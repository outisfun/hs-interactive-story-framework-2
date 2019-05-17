var frameworkData = {
    COMMONS: {
      CLASSES: {
        CONTENT: '.js--content'
      }
    },
    MODULES : {
      code: {
        CLASSES: {
          EL: '.isf-el_code'
        }
      },
      element_video: {
        CLASSES: {
            EL: '.js--video'
        }
      },
      element_gallery: {
        CLASSES: {
          EL: '.js--gallery',
          INNER: '.js--gallery__inner',
          ITEM: '.js--gallery__item'
        },
        CONSTRUCTOR: 'ISF_Element_Gallery'
      },
      element_gallery_preview : {
        CLASSES: {
          EL: '.js--gallery-preview',
          TRIGGER: '.js--gallery-preview__trigger',
          PREVIEW: '.js--gallery-preview__preview'
        },
        CONSTRUCTOR: 'ISF_Element_GalleryPreview'
      },
      element_gallery_horizontal : {
        CLASSES: {
          EL: '.js--gallery-horizontal',
          INNER: '.js--gallery-horizontal__inner',
          ITEM: '.js--gallery-horizontal__item'
        },
        CONSTRUCTOR: 'ISF_Element_GalleryHorizontal'
      },
      layout_chapter : {
        CLASSES: {
          EL: '.js--chapter',
          HEADER: '.js--chapter__header',
          CONTENT: '.js--chapter__content',
          IS__DARK: 'is--dark'
        },
        CONSTRUCTOR: 'ISF_Layout_Chapter'
      },
      layout_horizontal : {
        CLASSES: {
          EL: '.js--horizontal',
          BACKGROUND: '.js--horizontal__background',
          CONTENT: '.js--horizontal__content'
        },
        CONSTRUCTOR: 'ISF_Layout_Chapter'
      },
      layout_split_sticky : {
        CLASSES: {
          EL: '.js--split-sticky',
          STICKY: '.js--split-sticky__sticky',
          CONTENT: '.js--split-sticky__content'
        },
        CONSTRUCTOR: 'ISF_Layout_SplitSticky'
      },
      element_image : {
        CLASSES: {
          EL : '.js--image'
        },
        CONSTRUCTOR: 'ISF_Element_Image'
      },
      element_image_group : {
        CLASSES: {
          EL : '.js--image'
        }
      },
      element_text : {
        CLASSES: {
          EL: '.js--text'
        }
      },
      element_quote : {
        CLASSES: {
          EL : '.js--quote'
        }
      },
      layout_simple : {
        CLASSES: {
          EL: '.js--layout_simple',
          CONTENT: '.js--content'
        }
      }
    }
};

module.exports = frameworkData;
