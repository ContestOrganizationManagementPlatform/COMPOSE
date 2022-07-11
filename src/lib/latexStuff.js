import katex from "katex"

// needs to open with c1 and close with c2
// returns 0 if no mismatch, 1 if left open, -1 if premature close
function checkMismatch(str, c1, c2, ignoreBackslash) {
    let depth = 0, skip = false, lastC1 = 0;
    for (let i = 0; i < str.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }

        if (str[i] === '\\' && ignoreBackslash) {
            skip = true;
        } else if (str[i] === c2) {
            depth--;
        } else if (str[i] === c1) {
            depth++;
            lastC1 = i;
        }

        if (depth < 0) {
            return {
                err: -1,
                ind: i
            };
        }
    }

    return {
        err: depth > 0 ? 1 : 0,
        ind: depth > 0 ? lastC1 : -1,
    }
}

export function checkLatex(str, field) {
    let errorList = [];

    // check mismatching $
    let dollarCount = 0, skip = false;
    let curLine = 1;
    for (let i = 0; i < str.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }
        switch (str[i]) {
            case '\\':
                if (str[i+1] === ' ' || !str[i+1]) {
                    errorList.push({
                        error: `Backslash not escaping anything. If you want a set difference, use \\setminus. If you want an actual backslash, use \\textbackslash{}. (line ${curLine})`,
                        sev: "warn"
                    });
                }
                skip = true;
                break;
            case '$':
                dollarCount++;
                break;
            case '\n':
                curLine++;
                break;
            case '#':
            case '&':
                errorList.push({
                    error: `${str[i]} character used, make sure to use \\${str[i]} if you want it displayed as text (line ${curLine})`,
                    sev: "warn"
                });
                break;
            case '~':
                errorList.push({
                    error: `~ character used, make sure to use \\~{} if you want it displayed as text (line ${curLine})`,
                    sev: "info"
                });
                break;
        }
    }
    if (dollarCount % 2 === 1) {
        errorList.push({
            error: "Mismatching $ signs",
            sev: "err"
        });
    }

    // check for \ans in solution
    if (field === "solution" && str !== "") {
        if (!str.match("\\ans")) {
            errorList.push({
                error: "Missing \\ans in solution",
                sev: "err"
            })
        }
    }
    
    // check mismatched ()
    const parenMis = checkMismatch(str, "(", ")", true);
    if (parenMis.err !== 0) {
        let retErr = {
            error: "",
            sev: "warn"
        }
        if (parenMis.err === 1) {
            const subStr = str.substring(parenMis.ind-5, parenMis.ind+6);
            retErr.error = `Mismatched ( around "${subStr}"`;
        } else if (parenMis.err === -1) {
            const subStr = str.substring(parenMis.ind-10, parenMis.ind);
            retErr.error = `Mismatched ) after "${subStr}"`;
        }
        errorList.push(retErr);
    }

    // check between $$
    const dollarList = str.match(/[^$]*(\$\$|\$|.$)/gm) || [];
    let curInd = 0; // current index in actual string
    curLine = 1;
    let inDollars = false;
    for (const istr of dollarList) {
        // check mismatching brackets
        const bracketList = [
            ['{', '}', "err"],
            ['[', ']', "err"]
        ];
        for (const [c1, c2, sev] of bracketList) {
            const res = checkMismatch(istr, c1, c2, true);
            if (res.err !== 0) {
                let retErr = {
                    error: "",
                    sev: sev
                }
                if (res.err === 1) {
                    const linesBetween = (istr.substring(0, res.ind).match(/\n/g) || []).length;
                    const subStr = str.substring(curInd+res.ind-5, curInd+res.ind+6);
                    retErr.error = `Mismatched ${c1} around "${subStr}" (line ${curLine+linesBetween})`;
                } else if (res.err === -1) {
                    const linesBetween = (istr.substring(0, res.ind).match(/\n/g) || []).length;
                    const subStr = str.substring(curInd+res.ind-10, curInd+res.ind);
                    retErr.error = `Mismatched ${c2} after "${subStr}" (line ${curLine+linesBetween})`;
                }
                errorList.push(retErr);
            }
        }

        // check control sequences
        if (!inDollars) {
            const controlMatch = istr.match(/\\\w+/g) || [];
            for (const cc of controlMatch) {
                errorList.push({
                    error: `Control sequence ${cc} is outside of $$. Make sure this is intentional!`,
                    sev: "info"
                });
            }
        }

        curInd += istr.length;
        curLine += (istr.match("\n") || []).length;
        inDollars = !inDollars;
    }

    return errorList;
}

const macros = {
    "\\ans": "\\boxed{#1}"
}

// display the math mode parts of latex, rest as plaintext
// returns { out: output, errorList: [errors] }
export function displayLatex(str) {
    let i = 0;
    let out = "";
    let curToken = "";
    let insideMath = false;
    let esc = false;
    let errorList = [];
    let displayMode = false;
    let dispStack = []; // stack of endings for italics, bolds, etc

    // helper function to get next characters
    function nxt(c) {
        return str.substring(i, i+c);
    }
    while (i < str.length) {
        // here goes!
        if (nxt(2) === "$$" && !esc) {
            if (insideMath) {
                if (!displayMode) {
                    errorList.push({
                        error: "Mismatched display mode $$ vs inline mode $",
                        sev: "err"
                    });
                }
                try {
                    out += katex.renderToString(curToken, {
                        throwOnError: true,
                        output: "html",
                        displayMode: true,
                        macros: macros
                    });
                } catch (err) {
                    errorList.push({
                        error: err.toString(),
                        sev: "warn"
                    });
                    out += "ERROR";
                }
                insideMath = false;
                curToken = "";
            } else {
                insideMath = true;
                curToken = "";
                displayMode = true;
            }
            i += 2;
        } else if (str[i] === "$") {
            if (esc) {
                out += "$";
                curToken += "$";
            } else if (insideMath) {
                if (displayMode) {
                    errorList.push({
                        error: "Mismatched display mode $$ vs inline mode $",
                        sev: "err"
                    });
                }
                try {
                    out += katex.renderToString(curToken, {
                        throwOnError: true,
                        output: "html",
                        macros: macros
                    });
                } catch (err) {
                    errorList.push({
                        error: err.toString(),
                        sev: "warn"
                    });
                    out += "ERROR";
                }
                insideMath = false;
                curToken = "";
            } else {
                insideMath = true;
                curToken = "";
                displayMode = false;
            }
            i++;
        } else if (nxt(2) === "\n\n" && !esc) {
            if (!insideMath) out += "<br>";
            i += 2;
        } else if (str[i] === "\n" && !esc) {
            if (!insideMath) out += "\t";
            i++;
        } else if (str[i] === "<") {
            if (!insideMath) out += "&lt;";
            curToken += "<";
            i++;
        } else if (str[i] === ">") {
            if (!insideMath) out += "&gt;";
            curToken += ">";
            i++;
        } else if (str[i] === "{" && !esc) {
            if (!insideMath) out += "{";
            curToken += "{";
            dispStack.push("}");
            i++;
        } else if (str[i] === "}" && !esc) {
            if (dispStack.length !== 0) {
                const cc = dispStack.pop();
                if (!insideMath) out += cc;
                curToken += cc;
            }
            i++;
        } else if (nxt(6) === "\\emph{" && !esc) {
            if (!insideMath) out += "<i>";
            curToken += "\\emph{";
            dispStack.push("</i>");
            i += 6;
        } else if (nxt(8) === "\\textit{" && !esc) {
            if (!insideMath) out += "<i>";
            curToken += "\\textit{";
            dispStack.push("</i>");
            i += 8;
        } else if (nxt(8) === "\\textbf{" && !esc) {
            if (!insideMath) out += "<b>";
            curToken += "\\textbf{";
            dispStack.push("</b>");
            i += 8;
        } else if (nxt(11) === "\\underline{" && !esc) {
            if (!insideMath) out += "<u>";
            curToken += "\\underline{";
            dispStack.push("</u>");
            i += 11;
        } else if (str[i] === "\\" && i < str.length - 1 && !str[i+1].match(/[a-zA-Z]/)) {
            esc = true;
            i++;
            continue;
        } else {
            if (!insideMath) out += str[i];
            curToken += str[i];
            i++;
        }

        esc = false;
    }

    return {
        out: out,
        errorList: errorList
    }
}
