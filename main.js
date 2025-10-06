if ("serviceWorker" in navigator) {
                const req = navigator.serviceWorker.register("sw.js");
            };

            loadJSON("/versions", (response) => {
                const offlineStatus = document.getElementById("offline-status");
                if (!response) {
                    loadJSON("https://cdn.emulatorjs.org/versions.json", resp => loadVersions(resp));
                    offlineStatus.textContent = "Offline Status: NOT INSTALLED";
                } else {
                    loadVersions(response);
                    offlineStatus.textContent = "Offline Status: READY";
                }
            });

            loadSettings();

            input.addEventListener("change", async () => {
                const url = input.files[0];
                const parts = input.files[0].name.split(".");

                const core = await (async (ext) => {
                    if (["fds", "nes", "unif", "unf"].includes(ext))
                        return "nes"

                    if (["smc", "fig", "sfc", "gd3", "gd7", "dx2", "bsx", "swc"].includes(ext))
                        return "snes"

                    if (["z64", "n64"].includes(ext))
                        return "n64"

                    if (["pce"].includes(ext))
                        return "pce"

                    if (["ngp", "ngc"].includes(ext))
                        return "ngp"

                    if (["ws", "wsc"].includes(ext))
                        return "ws"

                    if (["col", "cv"].includes(ext))
                        return "coleco"

                    if (["d64"].includes(ext))
                        return "vice_x64"

                    if (["nds", "gba", "gb", "z64", "n64"].includes(ext))
                        return ext

                    return await new Promise(resolve => {
                        const cores = {
                            "Nintendo 64": "n64",
                            "Nintendo Game Boy": "gb",
                            "Nintendo Game Boy Advance": "gba",
                            "Nintendo DS": "nds",
                            "Nintendo Entertainment System": "nes",
                            "Super Nintendo Entertainment System": "snes",
                            "PlayStation": "psx",
                            "Virtual Boy": "vb",
                            "Sega Mega Drive": "segaMD",
                            "Sega Master System": "segaMS",
                            "Sega CD": "segaCD",
                            "Atari Lynx": "lynx",
                            "Sega 32X": "sega32x",
                            "Atari Jaguar": "jaguar",
                            "Sega Game Gear": "segaGG",
                            "Sega Saturn": "segaSaturn",
                            "Atari 7800": "atari7800",
                            "Atari 2600": "atari2600",
                            "NEC TurboGrafx-16/SuperGrafx/PC Engine": "pce",
                            "NEC PC-FX": "pcfx",
                            "SNK NeoGeo Pocket (Color)": "ngp",
                            "Bandai WonderSwan (Color)": "ws",
                            "ColecoVision": "coleco",
                            "Commodore 64": "vice_x64",
                            "Commodore 128": "vice_x128",
                            "Commodore VIC20": "vice_xvic",
                            "Commodore Plus/4": "vice_xplus4",
                            "Commodore PET": "vice_xpet",
                            "PlayStation Portable": "psp",
                            "DOS": "dosbox_pure"
                        }

                        const button = document.createElement("button")
                        const select = document.createElement("select")

                        for (const type in cores) {
                            const option = document.createElement("option")

                            option.value = cores[type]
                            option.textContent = type
                            select.appendChild(option)
                        }

                        button.onclick = () => resolve(select[select.selectedIndex].value)
                        button.textContent = "Load game"
                        box.innerHTML = ""

                        box.appendChild(select)
                        box.appendChild(button)
                    })
                })(parts.pop())

                const div = document.createElement("div")
                const sub = document.createElement("div")
                const script = document.createElement("script")

                sub.id = "game"
                div.id = "display"

                const top = document.getElementById("top");
                const version = document.getElementById("version");
                top.remove();
                version.remove();
                box.remove();
                div.appendChild(sub)
                document.body.appendChild(div)

                const cdn = window.cdn || "https://cdn.emulatorjs.org/stable/data/"

                window.EJS_player = "#game";
                window.EJS_gameName = parts.shift();
                window.EJS_biosUrl = "";
                window.EJS_gameUrl = url;
                window.EJS_core = core;
                window.EJS_pathtodata = cdn;
                window.EJS_startOnLoaded = true;
                window.EJS_AdUrl = "ads.html";
                window.EJS_DEBUG_XX = window.debug;
                if (window.language !== "auto") {
                    window.EJS_language = window.language;
                }
                if (core === "psp" || core === "dosbox_pure") {
                    window.EJS_threads = true;
                }
                window.EJS_ready = function() {
                    detectAdBlock("data:text/html;base64,DQo8aHRtbD48c3R5bGU+I2FkYmxvY2t7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC44KTtwb3NpdGlvbjpmaXhlZDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3RvcDowO2xlZnQ6MDt6LWluZGV4OjEwMDA7dGV4dC1hbGlnbjpjZW50ZXI7Y29sb3I6I2ZmZn1ib2R5LGh0bWx7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudH1hIHtjb2xvcjogIzAwYWZlNDt9PC9zdHlsZT48Ym9keSBzdHlsZT0ibWFyZ2luOjAiPjxkaXYgaWQ9ImFkYmxvY2siPjxoMT5IaSBBZGJsb2NrIFVzZXIhPC9oMT48cD5BZHMgb24gdGhpcyBwYWdlIG1heSBjb21lIGFuZCBnbyBkZXBlbmRpbmcgb24gaG93IG1hbnkgcGVvcGxlIGFyZSBmdW5kaW5nIHRoaXMgcHJvamVjdC48YnI+WW91IGNhbiBoZWxwIGZ1bmQgdGhpcyBwcm9qZWN0IG9uIDxhIHRhcmdldD0iX2Fib3V0IiBocmVmPSJodHRwczovL3BhdHJlb24uY29tL0VtdWxhdG9ySlMiPnBhdHJlb248L2E+PC9wPjwvZGl2PjwvYm9keT48L2h0bWw+");
                }
                
                script.src = cdn + "loader.js";
                document.body.appendChild(script);
            });

            box.ondragover = () => box.setAttribute("drag", true);
            box.ondragleave = () => box.removeAttribute("drag");

            let installPrompt = null;
            const installButton = document.querySelector("#install");
            const installBox = document.querySelector("#installbox");
            const installBoxText = document.querySelector("#installboxtext");
            localStorage.setItem("pwa", "false");

            window.addEventListener("beforeinstallprompt", (event) => {
                event.preventDefault();
                installPrompt = event;
                localStorage.setItem("pwa", "true");
                installButton.textContent = "Install";
                installButton.disabled = false;
                console.log("Supported");
            });

            installButton.addEventListener("click", async () => {
                if (!installPrompt) {
                    return;
                }
                const result = await installPrompt.prompt();
                console.log(`Install prompt was: ${result.outcome}`);
                installPrompt = null;
            });

            document.addEventListener('visibilitychange', function() {
                window.matchMedia('(display-mode: standalone)').addListener(event => {
                    if (event.matches) {
                        checkinstall(true);
                    }
                });
            });
