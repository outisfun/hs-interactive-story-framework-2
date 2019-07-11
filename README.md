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
section__intro: 
    layoutType: SIMPLE
    layoutData:
      container: container
    layoutContent: 
      # Text
      test__intro__text:
        elementType: text
        elementData: 
          highlight:  Swatch and BAPE are both masters of collaboration. First collaborating with artist Kiki Picasso in 1985, 
                      Swatch has worked over the years with legends such as Keith Haring, Vivienne Westwood, Damien Hirst, and Jeremy Scott. 
                      BAPE, it goes without saying, has been even more prolific, touching almost every aspect of modern culture and 
                      collaborating with everyone from Marvel to Google since the mid-‘90s.
          paragraph:  Unsurprisingly then we were pleased to learn earlier this month that Swatch and BAPE are at last coming 
                      together for a marriage of two OG collaborators and undeniably iconic brands. While today’s “collabs” are often 
                      just another part of the news cycle — hyped today and gone tomorrow — Swatch x BAPE has been somewhat of a long 
                      time coming and a collaboration we always hoped we’d see from two names with a history of killer partnerships.<br><br>
                      To make the news more exciting, it’ll be Swatch’s all-new BIG BOLD model that gets the BAPE treatment as the pair 
                      have come together to reimagine BIG BOLD in five city-inspired colorways and one global colorway.<br><br>
                      To prepare for today’s global drop, keep reading to find out why this collaboration is noteworthy and check out 
                      all six colorways.

```

Each section has layout (simple, chapter, interactive scroller, etc.) with specific layout data (container width, color scheme, etc.) and content which is basically a list of elements.

### Adding Custom Modules to a Story

Sometimes you would need to add a section or an element that does not exist in the framework. If it doesn't make sense to include it as a module for future use (e.g. it's too custom), run:
```
$ init-custom-module --story=YYYY-MM-projectName --customModule=your-module-name
```
The task creates a folder your-module-name in the ./src/modules/custom folder, and adds an empty .hbs file. Add a Handlebars template there, for example:
```
<nav class = "{{ customClass }}">
    {{ #each liEls }}
        <li><a href = "{{ liUrl }}">{{ liText }}</a></li>
    {{/ each }}
</nav>
```
Once you add the module, run ...
```
$ grunt handlebars
```
...which adds the compiled template to templates.js, so the story builder has access to it.
Use the module in your main data.yml like this:
```
proba_el:
  customModuleId: proba // this one has to be called customModuleId. It is what the framework uses to find the custom template.
  customVarTitle: Some heading or something
  anotherCustomVarTitle: https://images.com/placeholder.jpg
  andYetAnotherOne:
    - 
      src: https://test.com/image.jpg
    - 
      src: https://test.com/image2.jpg
  // add as many custom vars as you like
```
Note: What is important is that 'proba' matches the exact name of the module, and that the other custom variables correspond correctly to the ones in the hbs template. 

### Adding Custom Styles & Scripts

!Important: Add custom code only in custom.js and custom.scss to avoid overwriting when rebuilding story.

## Adding Modules to the Framework

To add a new layout or element, first create a folder in ./src/layouts or ./src/elements with the name, and add `*.hbs`, `*.scss`, `*.js` files.

### Adding Layouts

### Adding Elements





