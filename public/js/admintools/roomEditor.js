var roomEditor = {

    editorEl: null,
    templates: {
        textArea: '<div name="map">{rows}</div>',
        row: '<input type="text" class="roomEditor_row" name="map[{count}]" value="{cols}" />',
        col: ' ',
        preview: '<div class="roomEditor_preview">{rows}</div>',
        previewRow: '<div>{cols}</div>',
        previewCol: '<div></div>'
    },
    bgPos: {
        'nil': '0 -16px',
        'a': '0 0',
        'b': '-16px 0',
        'x': '-32px 0',
        '%': '-48px 0',
        '#': '-64px 0'
    },

    initialize: function(el, value) {
      this.editorEl = $(el);
      
      var rows = "", cols = "", previewRows = "", previewCols = "";
      for(var j=0; j<40; j++) { 
          cols += this.templates.col;
          previewCols += this.templates.previewCol;
      }
      for(var i=0; i<30; i++) {
          rows += this.templates.row
                        .replace("{cols}", value[i] || cols)
                        .replace("{count}", i);
          previewRows += this.templates.previewRow
                        .replace("{cols}", previewCols)
                        .replace("{count}", i);
      }

      this.editorEl.append(this.templates.textArea.replace("{rows}", rows));
      this.editorEl.parent().append(this.templates.preview.replace("{rows}", previewRows));

      this.rows = this.editorEl.children().children();
      this.preview = $(".roomEditor_preview")[0];
      this.onBgChange({currentTarget: $("input[checked]").parent()[0]});

      var self = this;
      this.editorEl.keydown(function(){ self.keyListener.apply(self, arguments); });
      this.editorEl.keyup(function(){ self.updatePreview.apply(self, arguments); });
      $(".image_select div").click(function() { self.onBgChange.apply(self, arguments); });
      this.rows.each(function(i, el) { self.updatePreview({target: el}); });
    },

    keyListener: function(e) {

      switch(e.keyCode) {
          case 8: //bkspc
              break;
          case 13: //enter
              e.preventDefault();
              e.stopPropagation();
              return false;
              break;
          case 17: //ctrl
              break;
          case 18: //alt
              break;
          case 35: //end
              break;
          case 36: //home
              break;
          case 37: //left
              break;
          case 38: //up
              $(e.target).prev().focus();
              break;
          case 39: //right
              break;
          case 40: //bottom
              $(e.target).next().focus();
              break;
          case 46: //del
              break;
          case 115: //f4
              break;
          case 116: //f5
              break;
          default:
              if(e.target.value.length >= 40 && !e.originalEvent.ctrlKey && e.originalEvent.shiftKey) {
                  e.preventDefault();
                  e.stopPropagation();
              }
              break;
      }

    },

    updatePreview: function(e) {
        var el = e.target, p = this.bgPos;
        var rowIndex = el.name.match(/\d+/)[0];
        var row = this.preview.childNodes[rowIndex];
        for(var j=0; j<40; j++) {
            var c = el.value[j] || 'nil';
            var pos = p[c] || p['nil'];
            row.childNodes[j].style.backgroundPosition = pos;
        }
    },

    onBgChange: function(e) {
        if(e.currentTarget) {
            this.preview.style.backgroundImage = e.currentTarget.style.backgroundImage.replace(/\d+/, e.target.value);
        }
    }
}