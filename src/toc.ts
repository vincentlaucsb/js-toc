function snakeCase(text: string) {
    return text.toLowerCase().split(" ").join("_");
}

interface TocItem {
    level: number; // e.g. <h4> --> 4
    name: string;
    id: string;
}

function scanHeaders(parent = document.body): Array<TocItem> {
    /*
     * Iterate through header tags in page
     * - Side effect: If header has no ID tag, generate one based by snake-casing
     *   the inner text
     *  - Otherwise, add ID to set of processed IDs
     *  - Also, if generated name collides with another one, append a number
     *
     * Return: An array of IDs
     * 
     */
    const headers = parent.querySelectorAll("h1, h2, h3, h4, h5, h6");
    let processed = Object();
    let temp = new Array();

    for (let i = 0; i < headers.length; i++) {
        const h = <HTMLElement>headers[i];
        let processed_id = h.getAttribute("id");

        // No ID found
        if (!processed_id) {
            const snake_cased = snakeCase(h.innerText);
            if (snake_cased in processed) {
                processed_id = snake_cased + "_" + ++processed[snake_cased];
            } else {
                processed_id = snake_cased;
                processed[processed_id] = 1;
            }
            
            h.setAttribute("id", processed_id);
        } else {
            processed[processed_id] = 1;
        }

        temp.push({
            'level': parseInt(h.tagName[1]), // get last character of 'H2'
            'name': h.innerText,
            'id': processed_id
        });
    }

    return temp;
}

function makeListItem(href: string, text: string) {
    // Generate a bullet point containing a link
    let link = document.createElement('a');
    link.setAttribute('href', href);
    link.innerHTML = text;

    let temp = document.createElement('li');
    temp.appendChild(link);
    return temp;
}

function makeList(listParams = {
    'target': "",
    'parent': "body"
}) {
    const headers = scanHeaders(document.querySelector(listParams.parent));

    // Keep track of where we are in the list;
    let parents = [
        document.createElement("ul")
    ];

    let currentLevel: number = null; // Used to determine when to indent/dedent list
    let prevBullet: HTMLLIElement = null;

    for (var i in headers) {
        let currentParent = parents.slice(-1)[0];
        const tocItem = headers[i];
        const link = makeListItem("#" + tocItem.id, tocItem.name);

        // Add link text
        if (currentLevel) {
            let levelDiff = tocItem.level - currentLevel;

            if (levelDiff <= 0) {
                // Dedent (or stay the same)
                while (parents.length > 1 && levelDiff) {
                    parents.pop();
                    levelDiff++;
                }
        
            } else if (levelDiff > 0) {
                // Indent
                while (levelDiff) {
                    var nextParent = document.createElement("ul");
                    prevBullet.appendChild(nextParent);
                    currentParent.appendChild(prevBullet);
                    currentParent = nextParent;
                    parents.push(nextParent);
                    levelDiff--;
                }
            }

            // Update parent
            currentParent = parents.slice(-1)[0];
        }

        // Update
        currentLevel = tocItem.level;
        currentParent.appendChild(link);
        prevBullet = link;
    }

    const target = document.querySelector(listParams.target);
    target.appendChild(parents[0]);
}