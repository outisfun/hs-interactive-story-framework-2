# HSNB Interactive Story Framework 2.0

A framework to speed up development of Tier 1 Interactive Stories.

## Getting Started

Clone & install dependencies:

```
$ npm install 
```

## Creating a story

Create a new folder with the template name YYYY-MM-projectName, or copy and rename the 0000-00-blank template folder in /stories, and add or edit the data.json file.
```
$ grunt build-story --target=YYYY-MM-projectName
```

Default watch task:
```
$ grunt build-story --target=YYYY-MM-projectName
```

Stories consist of three levels of data: pages, sections, and content groups within a section.
The structure looks like this:
```
- page 1
    - section 1.1
        - element 1.1.1
        - element 1.1.2
        - element 1.1.3
    - section 1.2
        - element 1.2.1
        - element 1.2.2
- page 2 // and so on.

```
Sections have two properties: layout (for example 'chapter' or 'interactive scroller' with layout-specific options) and content inside the layout element (text, images, galleries, etc).

// TO DO: Descriptions and READMEs of available elements and layouts

Adding a section looks like this:

```
{
    "index" :{
        "2019-05-bowie__bio": {
            "layoutType": "chapter",
            "layoutOptions": { // options specific to the layout type
                "colorScheme": "dark",
                "chapterStyle": "ralph-lauren",
                "chapterBackground": "https://interactive-development.hsnb.io/hsnbisf/assets/bowie2.jpg",
                "chapterTitle": "More Bowie stuff"
            },
            "layoutContent": {
                "2019-05-bowie__bio__text": { // optional id
                    "elementType": "text",
                    "elementData": { // data specific to the element type
                        "highlight": "Just look through your window, look who sits outside, Little me is waiting, standing through the night",
                        "paragraph": "Just look through your window, look who sits outside, Little me is waiting, standing through the night"
                    }
                }, // add as many elements as you like.
                "2019-05-bowie__bio__image": { // optional id
                    "elementType": "image",
                    "elementData": { // data specific to the element type
                        "src_small": "https://interactive-development.hsnb.io/hsnbisf/assets/bowie3_xs.jpg",
                        "src_large": "https://interactive-development.hsnb.io/hsnbisf/assets/bowie3.jpg"
                    }
                }
            }
        }
    }
}

```

Once the data structure is set, run the Grunt task for compiling script and style files and see how it looks! The task also turns the watcher on for any changes in scss/js files. Open the story at stories/YYYY-MM-projectName/dist.
```
$ grunt init --target='YYYY-MM-projectName'
```


## Effects

// Add an effect ?
// Syntax: data-x_animate_on_page_enter
// "fade_in", // fade_in_random
