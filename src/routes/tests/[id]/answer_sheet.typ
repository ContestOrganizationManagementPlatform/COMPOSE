#import "@preview/mitex:0.2.1": *

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
#let (problems, qr_code, test_metadata) = if is_local {
  (
    (
      (problem_latex: "What is $\\frac{1}{2} + \\frac{1}4?$"), (
        problem_latex: "Count how many toes you have. What is that number divided by $2$?",
      ),
    ), (image("./example-com.svg")), (name: "Test Name"),
  )
} else {
  (
    json("/assets/problems.json"), image("/assets/qr.svg"), json("/assets/test_metadata.json"),
  )
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

= #test_metadata.name

#qr_code

#set page(header: [
  #set text(10pt)
  #grid(
    columns: (12em, 1fr, 12em),
    // Left
    [#smallcaps("Stanford Math Tournament")],
    // Center
    align(center, [#smallcaps("Team Test")]),
    // Right
    align(right)[#smallcaps("April 8, 2023")],
  )
  #line(start: (0%, 0%), end: (100%, 0%), stroke: 1pt)
])

#enum(..problems.enumerate().map(((i, p)) => {
  let p_latex = replace_image(p.problem_latex)
  let p_typst = convert_to_typst(p_latex)
  enum.item(eval(p_typst, mode: "markup", scope: mitex-scope))
}))
