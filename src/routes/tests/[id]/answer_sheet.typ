#import "@preview/mitex:0.2.1": *
#import "@preview/codetastic:0.2.2": qrcode
#import "@preview/tablex:0.0.8": gridx, hlinex, vlinex

#let is_local = toml("./answer_sheet_compiling.toml").config.local
#let (problems, test_metadata) = if is_local {
  (
    (
      (
        problem_latex: "What is $\\frac{1}{2} + \\frac{1}4?$", answer_latex: "$\\frac{3}{4}$", solution_latex: "Think deeply, then guess the answer.",
      ), (
        problem_latex: "Count how many toes you have. What is that number divided by $2$?", answer_latex: "5", solution_latex: "Hopefully, you find that the left foot has 5, the right foot has 5, and the sum is $10.$ Then, we have $\\frac{10}2 = \\boxed{5}.$",
      ), ..range(20).map(
        i => (
          problem_latex: "Problem # " + str(i), answer_latex: "Generic answer", solution_latex: "Generic solution",
        ),
      ),
    ), (
      name: "Test Name", id: "T16", day: 13, month: 4, year: 2024, team_test: false, display: (answers: true, solutions: true),
    ),
  )
} else {
  (json("/assets/problems.json"), json("/assets/test_metadata.json"),)
}

// Make a qr code in a box.
#let make_qr(qr_string) = {
  let qr = (length: 70pt)
  let stroke = 2pt
  let qr_box = (length: qr.length + 2 * stroke, stroke: stroke)
  let font-size = 8pt

  set text(font-size)

  let in_box(target_string) = {
    box(width: qr_box.length, [
      #qrcode(target_string, width: qr.length, quiet-zone: 0, ecl: "l")

      #target_string
    ], inset: 2pt)
  }
  let qr_and_text = in_box(qr_string)

  align(
    center, style(
      styles => {
        let (width, height) = measure(qr_and_text, styles)
        let padding = 4pt
        box(
          width: width + padding, height: height + padding, stroke: qr_box.stroke, align(center + horizon, qr_and_text), inset: padding + qr_box.stroke / 2,
        )
      },
    ),
  )
}

#let id_label(id) = {
  // QR code and text to the right.
  box(
    width: 2.625in, height: 1in, stroke: 1pt + gray, radius: 6pt, inset: 0pt, fill: white,
  )[
    // Two column grid with a dividing line.
    #gridx(
      columns: (1in, 1fr), rows: (1fr), qrcode(id, width: 0.8in, quiet-zone: 0, ecl: "l"), align: center + horizon, vlinex(), id,
    )
  ]
}

#let id_box(fill: none, inset: 8pt, content) = {
  let stroke = 1pt
  box(
    width: 2.625in + stroke * 2, height: 1in + stroke * 2, stroke: stroke, radius: 3pt, inset: inset, fill: fill, content,
  )
}

#let identification_sticker_box = {
  // id_box(fill: gray.lighten(50%), "Place Identification Sticker Here")
  id_box(fill: gray.lighten(50%), if is_local {
    set text(size: 16pt)
    id_label("001A")
  } else {
    "Place Identification Sticker Here"
  })
}

#let written_identification_box = {
  set text(10pt)
  let rows = if test_metadata.team_test {
    ([Team ID (e.g. 001): ], [Team Name: ])
  } else {
    ([Student ID (e.g. 001A): ], [Student Name: ], [Team Name: ],)
  }
  id_box(
    inset: 0pt, gridx(
      columns: (100%), rows: rows.map(_ => 1fr), align: start + horizon, stroke: 0.5pt, ..rows.intersperse(hlinex()),
    ),
  )
}

// Set page size and set page header for answer sheet boxes.
#set page(
  header: locate(
    location => [
      #set text(10pt)
      #place(
        top + right, dy: 10pt, make_qr(test_metadata.id + "P" + str(location.page())),
      )
      #align(
        center + horizon, [
          #text(
            weight: "bold", 18pt, test_metadata.name + " Test (" + if test_metadata.team_test { "Team" } else { "Individual" } + ")",
          ) \ \
          #text(12pt, "Stanford Math Tournament") \
          #v(0pt)
          #text(
            10pt, datetime(
              day: test_metadata.day, month: test_metadata.month, year: test_metadata.year,
            ).display("[month repr:short] [day], [year padding:zero repr:full]"),
          )
        ],
      )
      #grid(
        columns: (1fr, 1fr), align(center + horizon, written_identification_box), align(center + horizon, identification_sticker_box),
      )
      #line(start: (0%, 0%), end: (100%, 0%), stroke: 1pt)

    ],
  ), header-ascent: 12%, margin: (top: 30%), height: 11in, width: 8.5in,
)

#let answer_box(i, layout) = {
  // Rounded corners box.
  box(
    width: 100% * layout.width, height: 0.55in, stroke: 1pt, radius: 5pt, [
      // Two column grid with a dividing line.
      #gridx(
        columns: (0.5in, 1fr), rows: (1fr), [#{ i + 1 }.], align: center + horizon, vlinex(), "",
      )
    ],
  )
}

#let problem_count = problems.len()

// Generate boxes and measure them.
#{
  columns(3, gutter: 11pt, range(problem_count).map(i => {
    layout(size => {
      style(styles => {
        let elem = answer_box(i, size)
        [#elem #metadata(measure(elem, styles)) #label("box_" + str(i))]
      })
    })
  }).join())
}

// Generate metadata for box positions. (accessible via external query)
#locate(loc => {
  let a = range(problem_count).map(i => {
    let elem = query(selector(label("box_" + str(i))), loc).first()
    (elem.value, elem.location().position(),)
  });
  [#metadata(a) #label("box_positions")]
})

// Set page header for problems.
#set page(header: [
  #set text(10pt)
  #grid(
    columns: (12em, 1fr, 12em),
    // Left
    [#smallcaps("Stanford Math Tournament")],
    // Center
    align(center, [#smallcaps(test_metadata.name)]),
    // Right
    align(right)[#smallcaps("April 8, 2023")],
  )
  #line(start: (0%, 0%), end: (100%, 0%), stroke: 1pt)
], margin: auto)

// Typeset problems.
#let macros = (
  // Boxing answers
  "\\ans": ("[1]", "\\boxed{#1}"),
  // Wrap with absolute value
  "\\Abs": ("[1]", "\\left\\lVert #1 \\right\\rVert"),
  // Wrap with < > angle brackets
  "\\ang": ("[1]", "\\left \\langle #1 \\right \\rangle"),
  // Set notation {x, y}
  "\\set": ("[1]", "\\left\\{#1\\right\\}"),
  // Scaled parentheses
  "\\paren": ("[1]", "\\left(#1\\right)"),
  // Floor brackets
  "\\floor": ("[1]", "\\left\\lfloor #1 \\right\\rfloor"),
  // Ceiling brackets
  "\\ceil": ("[1]", "\\left\\lceil #1 \\right\\rceil"),
  // Vector notation, overarrow
  "\\VEC": ("[1]", "\\overrightarrow{#1}"),
  // Modulus operator
  "\\Mod": ("[1]", "\\enspace(\\text{mod}\\ #1)"),
).pairs().map(pair => {
  let (name, value) = pair
  let (arg_count, body) = value
  "\\newcommand{" + name + "}" + arg_count + "{" + body + "}"
}).join()

#let replace_image(latex) = {
  let image_regex = regex(`\\(image|includegraphics)(\[[^\]]*\])*\{([^\}]+)\}`.text);
  latex.replace(image_regex, (m, ..) => {
    let path = "/problem_images" + m.captures.last()
    "\\iftypst\n #figure(image(\"" + path + "\", height: 20%))\n\\fi"
  })
}

#let convert_to_typst(latex) = {
  // When mitex supports brackets, we can remove this.
  latex = latex.replace("\\(", "$")
  latex = latex.replace("\\)", "$")
  latex = latex.replace("\\[", "$$")
  latex = latex.replace("\\]", "$$")
  mitex-convert(mode: "text", macros + replace_image(latex))
}

#set enum(tight: false)
#enum(
  ..problems.enumerate().map(
    ((i, p)) => {
      let p_latex = replace_image(p.problem_latex)
      let p_typst = convert_to_typst(p_latex)
      enum.item(
        [
          #eval(p_typst, mode: "markup", scope: mitex-scope)

          #if test_metadata.display.answers {
            [
              *Answer: #eval(
                convert_to_typst(replace_image(p.answer_latex)), mode: "markup", scope: mitex-scope,
              )*
            ]
          }

          #if test_metadata.display.solutions {
            [
              *Solution:* #eval(
                convert_to_typst(replace_image(p.solution_latex)), mode: "markup", scope: mitex-scope,
              )
            ]
          }
        ],
      )
    },
  ),
)
