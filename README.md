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
$ grunt init-story --story=YYYY-MM-projectName
```

The task creates a folder with build and dist subfolders, and an empty json file, which would contain the structure of your story.
To start building the page, add elements in the json. // provide examples
Then build the story:

```
$ grunt build-story --story=YYYY-MM-projectName
```

This compiles the json file into a layout with styles and scripts, and starts a watch task looking for changes in the build/script.js and build/style.scss files.
To run the watch task standalone, use:

```
$ grunt --story=YYYY-MM-projectName
```

### Adding Framework Modules to a Story

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


### Adding Custom Modules to a Story

Sometimes you would need to add a section or an element that does not exist in the framework. If it doesn't make sense to include it as a module for future use (e.g. it's too custom), run:
```
$ init-custom-module --story=YYYY-MM-projectName --customModule=moduleName
```
The task creates a folder custom_moduleName in the story folder, and adds an empty .hbs file. Add a Handlebars template there, for example:
```
<nav class = "{{ customClass }}">
    {{ #each liEls }}
        <li><a href = "{{ liUrl }}">{{ liText }}</a></li>
    {{/ each }}
</nav>
```

...and use the module in your main data.json like this (it's important that the object attributes match the variables in the template).
```
'custom_moduleName': {
    'customClass': 'nav--something',
    'liEls': [
        { 'liUrl':'www.test.com', liText:'text for nav' },
        { 'liUrl':'www.proba.com', liText:'something else' } // and so on
    ]
}
```


## Adding Modules to the Framework

### Adding Layouts

### Adding Elements

### Adding Effectss




