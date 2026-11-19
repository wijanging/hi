# hi.iam.wijangi.ng

El's website. The design is in `index.html` and `assets/`. The words and photos are in `content/` and `photos/`.

## How to change the words

1. Open the `content` folder and pick a file, for example `wushu.md`.
2. On GitHub, click the pencil icon, change the text, then click **Commit changes**.
3. Wait about a minute and refresh the website.

| File | Section on the page |
|------|---------------------|
| `content/hello.md` | The introduction at the top. The list becomes the coloured tags. |
| `content/hello-photo.md` | The big photo at the top |
| `content/wushu.md` | 01 Move |
| `content/school.md` | 02 Lead |
| `content/planet.md` | 03 Care |
| `content/dream.md` | 04 Dream |
| `content/explore.md` | 05 Explore |
| `content/books.md` | 06 Read |
| `content/say-hi.md` | 07 Say hi |
| `content/pages/record.md` | The "Competition record" page |
| `content/pages/clubs.md` | The "Clubs and courses" page |

## Markdown cheat sheet

```
# Big title
## Smaller title

Normal text. **Bold text gets a highlighter.**

- a list item
- another one

> A quote, shown in handwriting.

[words to click](https://example.com)

![caption under the photo](photos/file-name.jpg)

| Year | Competition | Result |
|------|-------------|--------|
| 2026 | Name of the competition | Gold |
```

In a table, the last column is coloured automatically when it says Gold, Silver, Bronze or Rank.

## How to add a photo

1. Put the photo in the `photos` folder. Use a simple name with no spaces, like `kinabalu.jpg`.
2. In a `.md` file write `![caption](photos/kinabalu.jpg)`.
3. Put several photos on the same line to show them side by side.

If the page shows a striped box that says "photo goes here", the file named in the box is missing from `photos`. Add a photo with exactly that name and it will appear.

Keep photos small: about 1200 pixels wide is plenty.

## How to add a new page

1. Create a new file in `content/pages`, for example `books.md`.
2. Link to it from anywhere with `[my books](page.html?p=books)`.

## How to add a new section on the home page

Open `index.html`, copy one `<section>` block, and point `data-md` at your new `.md` file.
Colours: `t-coral`, `t-sun`, `t-mint`, `t-lilac`, `t-sky`.

## Preview on your own computer

```
python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` by double click will not work, because the browser blocks loading the Markdown files that way.
