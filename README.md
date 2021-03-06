# HSNB Interactive Story Framework 2.0

A framework to speed up development of Tier 3 Interactive Stories.

## TO DO:
// remove classes and double check that media uploads work correctly!!!!!
// general style suggestions: separate chapters with quotes and other common scenarios
// To do (for me): Add all possible layouts and modules in a preview story.

## Getting Started

Clone & install dependencies & grunt:

```
$ npm install 
$ npm install -g grunt-cli
```

## Creating a story

### Workflow

That's of course, a matter of personal taste, but I find it easiest like this:

#### Setting up the story structure

```
$ grunt init-story --story=YYYY-MM-projectName
```

The task creates a folder ./stories/YYYY-MM-projectName with build and dist subfolders, and an example data.yml file, which would contain the structure of your story.
To start building the page, add elements in the yml. 

!!! You can check out the data.yml of some of the stories so far, but since we moved to yml a bit later, the ones you can actually use as reference are the ones from June 2019 on (2019-06-... etc.).

For example, this is a simple page:

```
---
# HSNBISF: TEST STORY #######################################################

index : // specify the page. so far it's just index

  # FIRST SECTION
  custom_section_id: // this can be anything. it's used as a id of the section in the markup. should not be repeated.
    layoutType: SIMPLE 
    layoutData:
      container: container
      colorScheme: dark

    layoutContent: 

      # Intro text
      custom_section_id__text: // custom id - it can be whatever you want, but it should not repeat
        elementType: text
        elementData: 
          highlight:  "In the beginning, ellesse made apparel for two quintessentially Italian sports: skiing and 
                      tennis. Servadio’s tailored approach led to iconic designs like the Jet Pant which was 
                      included at a celebration of Italian design at the Pompidoud Centre in 1979."
          paragraph:  ellesse founder Leonardo Servadio started out as a tailor in his hometown Perugia, Italy. 
                      Like many great ideas, ellesse — which gets its name from Servadio’s initials L.S. — 
                      was a way for its founder to scratch his own itch. Born into a family of textile merchants, 
                      Servadio dreamt of fasdasddafadsdfdsdfsshion-forward sportswear that suited his stylish, tailored aesthetic. 
                      With nothing satisfying available, Servadio decided to apply his knowledge to redefining 
                      sportswear and, with that, ellesse was born in 1959.

      # LAYOUT VIDEO
      custom_section_id__video:
        elementType: video
        elementData: 
          videoId:  M7KADWuo
          playerId: bUaBxxgc
```

Each page (in this case just index.html) is comprised of sections. Each section has three main properties: layoutType (what should it look/work like?), layoutData (this one varies depending on the layoutType - more below!) and layoutContent, which wraps a list of elements.
Each element, in turn, has its own specific element data.
Saving the new data.yml file compiles the markup, scripts and styles again. Now you can view the page in dist!

!!! Important: the custom IDs can be anything, but should not be repeated.

### Managing assets

You can upload all your assets (during testing and previews) to Google Cloud, z.B.:
interactive-development.hsnb.io/YYYY-MM-projectName/assets.

### Available Modules

All the available modules are listed in ./src/fd.yml which is the framework data. If you want to add a new one or modify the existing ones, you should also do it there.

#### Layout: Simple
```
  example_simple_layout: 
    layoutType: SIMPLE 
    layoutData:
      container: container // options: 'container', 'container-fluid'
      colorScheme: dark // options: 'dark' or nothing  

    layoutContent: 
      ...
```

#### Layout: Chapter
```
  example_chapter_layout: 
    layoutType: CHAPTER
    layoutData:
      chapterStyle: ralph-lauren // options: 'ralph-lauren', 'ellie', 'black'. 
      // To add a new style, just add a your-style-name.scss file in layouts/chapter and include it in style.scss.
      // Check out ralph-lauren.scss and ellie.scss as examples of what you can tweak!
      chapterBackground: https://interactive-development.hsnb.io/2019-04-ellesse/assets/lh_chapter.jpg
      chapterTitle: Section Header

    layoutContent: 
      ...
```

#### Layout: Split Sticky
```
  example_splitsticky_layout: 
    layoutType: SPLITSTICKY
    layoutData:
      stickyImage: https://....something.jpg

    layoutContent: 
      ...
```
!!! Important: Because of the split layout, not everything looks good in the content section. For example videos!

#### Layout: Interactive Scroller
```
  example_scroller_layout: 
    layoutType: INTERACTIVESCROLLER
    layoutData:
      stickyImage: https://....something.jpg

    layoutContent: 
      ...
```
!!! To do (for me): Figure out a more elegant way to build scenes. Don't use for now!

#### Element: Text
```
  example_text:
    elementType: TEXT
    elementData: 
      headline:   Some headline
      highlight:  "In the beginning, ellesse made apparel for two quintessentially Italian sports: skiing and 
                  tennis. Servadio’s tailored approach led to iconic designs like the Jet Pant which was 
                  included at a celebration of Italian design at the Pompidou Centre in 1979."
      paragraph:  ellesse founder Leonardo Servadio started out as a tailor in his hometown Perugia, Italy. 
                  Like many great ideas, ellesse — which gets its name from Servadio’s initials L.S. — 
                  was a way for its founder to scratch his own itch. Born into a family of textile merchants, 
                  Servadio dreamt of fasdasddafadsdfdsdfsshion-forward sportswear that suited his stylish, tailored aesthetic. 
                  With nothing satisfying available, Servadio decided to apply his knowledge to redefining 
                  sportswear and, with that, ellesse was born in 1959.
```
All fields are optional. If you don't enter a headline, nothing's going to be displayed. This allows for varying text blocks.

#### Element: Quote
```
  example_quote:
    elementType: QUOTE
    elementData: 
      quote:   Like many great ideas, ellesse — which gets its name from Servadio’s initials L.S. — 
               was a way for its founder to scratch his own itch.
      source:  Name Surname
```

#### Element: Image Group (can be used for up to three images, or a standalone image)
```
  example_imagegroup:
    elementType: IMAGEGROUP
    elementData: 
      images: // 1 to 3
        -
          src: https://interactive-development.hsnb.io/2019-04-ellesse/assets/lh49.jpg
        -
          src: https://interactive-development.hsnb.io/2019-04-ellesse/assets/lh51.jpg
```

#### Element: Video 
```
  example_imagegroup:
    elementType: VIDEO
    elementData: 
      videoId:  M7KADWuo
      playerId: bUaBxxgc
```

#### Element: Gallery (for more than 3 images)
```
  example_gallery:
    elementType: GALLERY
    elementData: 
      galleryLayout: masonry // options: masonry, grid, and prada
      galleryPreview: true // does the image open full screen on click?
      galleryImages: 
        -
          src: https://interactive-development.hsnb.io/2019-04-ellesse/assets/Ellesse6.jpg
          caption: optional caption
        -
          src: https://interactive-development.hsnb.io/2019-04-ellesse/assets/Ellesse6.jpg
          caption: optional caption
        -
          src: https://interactive-development.hsnb.io/2019-04-ellesse/assets/Ellesse6.jpg
          caption: optional caption
        -
          src: https://interactive-development.hsnb.io/2019-04-ellesse/assets/Ellesse6.jpg
          caption: optional caption
        -
          src: https://interactive-development.hsnb.io/2019-04-ellesse/assets/Ellesse6.jpg
          caption: optional caption 
        -
          src: https://interactive-development.hsnb.io/2019-04-ellesse/assets/Ellesse6.jpg
          caption: optional caption
        -
          src: https://interactive-development.hsnb.io/2019-04-ellesse/assets/Ellesse6.jpg
          caption: optional caption     
```
!!! Important: All the gallery layouts depend very much on the images and may not necessarily look good with the available assets.
Gallery as a module hasn't been thoroughly debugged, so something might not work as expected, but I'll try to fix everything before I leave.
!!! To do (for me): A preview of all gallery styles. And maybe renaming prada.


### Adding Custom Modules to a Story

Sometimes you would need to add an element that does not exist in the framework. 
If it doesn't make sense to include it as a module for future use (e.g. it's too custom), run:
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
!!! Important: For now, you can only add elements (and not layouts). If you need a new layout, just add it to the framework as a regular module.

### Adding Custom Styles & Scripts

!Important: Add custom code only in custom.js and custom.scss to avoid overwriting when rebuilding story.

## Adding Modules to the Framework

To add a new layout or element, first create a folder in ./src/layouts or ./src/elements with the name, and add `*.hbs`, `*.scss`, `*.js` files. (JS is optional, you may not need it for the simpler elements).
Second, you need to add information about the module in the framework data file (`./src/fd.yml`), so the framework knows it's there.
Each element has three data components: DATA (custom data elements that you pass in the data.yml file), CLASSES and CONSTRUCTOR, as the latter two are only necessary for modules with a script.js file (CHAPTER, for example, relies on a custom constructor). Again, run...
```
$ grunt handlebars
```
...and the module should be ready to use!

## Setting up and sending previews (to clients, HS+ and Harry/Shaun)

Internally (for Harry / Shaun and mostly HS+) you can use the Google Cloud folder: https://interactive-development.hsnb.io/YYYY-MM-projectName/index.html, but in this case, you would also need to upload the index.html file from dist/.

For clients, we send a preview either on Staging/QA (as a published post) or on the live site as a draft.
In the latter case, don't forget to check the Enable Client Preview box!

## Publishing a story to Staging

### Upload scripts and styles to Google Cloud (for testing and previews)

Create a folder YYYY-MM-projectName, and upload all dist files there.
Copy also index.html for the sake of keeping track, and also because it allows you to send a quick preview:
https://interactive-development.hsnb.io/YYYY-MM-projectName/index.html

Storing scripts and styles there allows you to quickly edit them and skip the Amazon caching.
Add the following two lines in the end of the story, after the custom markup:
```
<script type = 'text/javascript' src = 'https://interactive-development.hsnb.io/YYYY-MM-projectName/scripts.js'></script>
<link rel = 'stylesheet' href = 'https://interactive-development.hsnb.io/YYYY-MM-projectName/styles.css' />
```

## Publishing a story to Live

### Upload scripts and styles to S3 

Once clients and everyone is happy with the story, and you expect no more CSS/JS changes, you can upload the scripts/styles to S3 (just merge with the master branch in the repo below).

In your local copy of this repo: https://github.com/titel-media/hs-interactive-stories, create a new folder in src/ that follows the same structure: YYYY-MM-projectName, and upload dist/scripts.js and styles.css directly there. Create a pull request and merge it.
You can also push a copy of index.html for archiving purposes.

This repo contains the finished scripts and styles of all stories so far and is accessible by WordPress.

Once the files are uploaded, delete those two lines:
```
<script type = 'text/javascript' src = 'https://interactive-development.hsnb.io/YYYY-MM-projectName/scripts.js'></script>
<link rel = 'stylesheet' href = 'https://interactive-development.hsnb.io/YYYY-MM-projectName/styles.css' />
```
... and add the folder ID (just the name of the project folder in src/ ) in the Custom Template ID field. This way, the scripts and styles are loaded through S3.
Once again: S3 caches like crazy, so avoid making changes there. If you *have to* though, you can get away with a little inline CSS last-minute.

### Replace standalone images with uploads in the Media Library

Unfortunately, there's no quick workaround here - I've been doing them manually on the live server, but if you think of something smarter, go ahead!

## Important grunt commands

Default watch task:
```
$ grunt --story=YOUR-STORY-NAME
```

Compiles templates (useful if you added a new or changed an existing one):
```
$ grunt handlebars
```

Init story:
```
$ grunt init-story --story=YOUR-STORY-NAME
```

Init custom module (and after you added the hbs template, run the compile task):
```
$ grunt init-custom-module --customModule=YOUR-MODULE-NAME
```

Lint everything!:
```
$ grunt lintall
```

## Rarely asked questions (because so far there was no one to ask me anything anyway) and some general remarks

Whenever you add a new file or a module (this would be rare, but still), you need to restart the watch task, so it can start watching the new file:
```
$ grunt --story=YOUR-STORY-NAME
```

Some common errors may include:





