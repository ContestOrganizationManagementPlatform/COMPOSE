#import "@preview/mitex:0.2.1": *
#import "@preview/codetastic:0.2.2": qrcode

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
}).join("\n")

#let is_local = toml("./answer_sheet_compiling.toml").config.local
#let (problems, test_metadata) = if is_local {
  (
    (
      (problem_latex: "What is $\\frac{1}{2} + \\frac{1}4?$"), (
        problem_latex: "Count how many toes you have. What is that number divided by $2$?",
      ),
    ), (name: "Test Name", id: "T16", day: 13, month: 4, year: 2024),
  )
} else {
  (json("/assets/problems.json"), json("/assets/test_metadata.json"),)
}

#let replace_image(latex) = {
  let image_regex = regex(`\\(image|includegraphics)(\[[^\]]*\])*\{([^\}]+)\}`.text);
  latex.replace(image_regex, (m, ..) => {
    let path = "/problem_images" + m.captures.last()
    "\\iftypst\n #figure(image(\"" + path + "\", height: 20%))\n\\fi"
  })
}

#let convert_to_typst(latex) = {
  mitex-convert(mode: "text", macros + "\n" + replace_image(latex))
}

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

  let qr_and_text = in_box(if qr_string != none { qr_string } else { "measuring string" })

  align(
    center, style(
      styles => {
        let (width, height) = measure(qr_and_text, styles)
        let padding = 4pt
        box(
          width: width + padding, height: height + padding, stroke: qr_box.stroke, align(center + horizon, if qr_string != none {
            qr_and_text
          } else {
            "Test Taker \nID Sticker"
          }), inset: padding + qr_box.stroke / 2, fill: if qr_string != none {
            none
          } else {
            gray.lighten(80%)
          },
        )
      },
    ),
  )
}

#set page(
  header: [
    #set text(10pt)
    #place(top + left, dy: 10pt, make_qr(test_metadata.id))
    #place(top + right, dy: 10pt, make_qr(none))
    #align(
      center + horizon, [
        #text(weight: "bold", 18pt, "Stanford Math Tournament") \ \
        #text(12pt, test_metadata.name + " Test")
        #v(0pt)
        #text(
          10pt, datetime(
            day: test_metadata.day, month: test_metadata.month, year: test_metadata.year,
          ).display("[month repr:short] [day], [year padding:zero repr:full]"),
        )
      ],
    )
    #line(start: (0%, 0%), end: (100%, 0%), stroke: 1pt)
  ], header-ascent: 30%, margin: (top: 20%),
)

= #test_metadata.name

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

#enum(..problems.enumerate().map(((i, p)) => {
  let p_latex = replace_image(p.problem_latex)
  let p_typst = convert_to_typst(p_latex)
  enum.item(eval(p_typst, mode: "markup", scope: mitex-scope))
}))
