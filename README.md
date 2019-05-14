# HSNB Interactive Story Framework 2.0

A framework to speed up development of Tier 1 Interactive Stories.

## Getting Started

Clone & install dependencies & grunt:

```
$ npm install 
$ npm install -g grunt-cli
```

## Creating a story

```
$ grunt init-story --target=YYYY-MM-projectName
```

The task creates a folder with build and dist subfolders, and an empty json file, which would contain the structure of your story.
To start building the page, add elements in the json. // provide examples
Then build the story:

```
$ grunt build-story --target=YYYY-MM-projectName
```

This compiles the json file into a layout with styles and scripts, and starts a watch task looking for changes in the build/script.js and build/style.scss files.
To run the watch task standalone, use:

```
$ grunt --target=YYYY-MM-projectName
```

Stories consist of three levels of data: pages (for interactive stories that have more than one page), layouts (sections), and elements inside a section:
```
- page 1
    - slayout 1.1
        - element 1.1.1
        - element 1.1.2
        - element 1.1.3
    - layout 1.2
        - element 1.2.1
        - element 1.2.2
- page 2 // and so on.

```

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


## Adding Modules

// Add an effect ?
// Syntax: data-x_animate_on_page_enter
// "fade_in", // fade_in_random
