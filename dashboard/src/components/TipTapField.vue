<template>
  <div class="TipTap">
    <EditorMenuBar :editor="editor" v-slot="{ commands, isActive }">
      <el-button-group>
        <el-button
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >H1</el-button>
        <el-button
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >H2</el-button>
        <el-button
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >H3</el-button>
        <el-button :class="{ 'is-active': isActive.center_align() }" @click="commands.center_align">
          <i class="material-icons">format_align_center</i>
        </el-button>
        <el-button :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list">
          <i class="material-icons">format_list_bulleted</i>
        </el-button>
        <el-button :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list">
          <i class="material-icons">format_list_numbered</i>
        </el-button>
        <el-button :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote">
          <i class="material-icons">format_quote</i>
        </el-button>
        <el-button :class="{ 'is-active': isActive.code_block() }" @click="commands.code_block">
          <i class="material-icons">code</i>
        </el-button>
        <el-button :class="{ 'is-active': isActive.table() }" @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })">
          <i class="material-icons">apps</i>
        </el-button>
      </el-button-group>
    </EditorMenuBar>

    <EditorMenuBubble :editor="editor" :keep-in-bounds="keepInBounds" v-slot="{ commands, isActive, menu }" >
      <el-button-group
        class="menububble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`">
        <el-button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
          <i class="material-icons">format_bold</i>
        </el-button>
        <el-button :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
          <i class="material-icons">format_italic</i>
        </el-button>
        <el-button :class="{ 'is-active': isActive.underline() }" @click="commands.underline">
          <i class="material-icons">format_underline</i>
        </el-button>
        <el-button :class="{ 'is-active': isActive.code() }" @click="commands.code">
          <i class="material-icons">code</i>
        </el-button>
      </el-button-group>
    </EditorMenuBubble>

    <EditorMenuBubble :editor="editor" :keep-in-bounds="keepInBounds" v-slot="{ commands, isActive, menu }" >
      <el-button-group
        class="menububble"
        :class="{ 'is-active': isActive.table() }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom+40}px;`">
        <el-button @click="commands.deleteTable" title="Delete Table">
          <i class="material-icons">border_clear</i>
        </el-button>
        <el-button @click="commands.addColumnBefore" title="Add Column Before">
          <i class="material-icons">border_left</i>
        </el-button>
        <el-button @click="commands.addColumnAfter" title="Add Column After">
          <i class="material-icons">border_right</i>
        </el-button>
        <el-button @click="commands.deleteColumn" title="Delete Column">
          <i class="material-icons">border_vertical</i>
        </el-button>
        <el-button @click="commands.addRowBefore" title="Add Row Before">
          <i class="material-icons">border_top</i>
        </el-button>
        <el-button @click="commands.addRowAfter" title="Add Row After">
          <i class="material-icons">border_bottom</i>
        </el-button>
        <el-button @click="commands.deleteRow" title="Delete Row">
          <i class="material-icons">border_horizontal</i>
        </el-button>
        <el-button @click="commands.toggleCellMerge" title="Merge Cell">
          <i class="material-icons">border_outer</i>
        </el-button>
      </el-button-group>
    </EditorMenuBubble>
    <EditorContent :editor="editor" />
  </div>
</template>

<script>
import { Node, Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  HardBreak,
  Heading,
  History,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TodoItem,
  TodoList,
  Strike,
  Underline
} from 'tiptap-extensions'
import { wrappingInputRule, toggleWrap } from 'tiptap-commands'

class CenterAlign extends Node {
  name = 'center_align'

  schema = {
    content: 'block*',
    group: 'block',
    parseDOM: [{
      tag: 'center'
    },{
      style: 'text-align',
      getAttrs: value => value === 'center'
    }],
    toDOM: () => ['center', 0]
  }

  commands({type, schema}) {
    return () => toggleWrap(type, schema.nodes.paragraph)
  }
}

export default {
  name: 'TipTap',
  props: {
    value: {type: String},
    disabled: {type: Boolean}
  },
  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble
  },
  data() {
    return {
      keepInBounds: true,
      editor: new Editor({
        content: this.value,
        extensions: [
          new Blockquote(),
          new Bold(),
          new BulletList(),
          new Code(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new History(),
          new Italic(),
          new Link(),
          new ListItem(),
          new OrderedList(),
          new Table({
            resizable: true,
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new TodoItem(),
          new TodoList(),
          new Strike(),
          new Underline(),
          new CenterAlign(),
        ],
        onUpdate: ({ getHTML }) => {
          this.syncValue = getHTML()
        },
      }),
    }
  },
  computed: {
    syncValue: {
      get() {
        return this.value
      },
      set(url) {
        this.$emit("input", url);
      }
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss">
.TipTap {
  min-width: 100px;
  width: 100%;
  max-height: 400px;
  border-radius: 10px;
  padding: 4px;
  background: var(--light);
  overflow: hidden;

  &>div {
    max-height: 300px;
    overflow-y: scroll;
  }

  button.el-button {
    padding: 5px 6px;
    width: 36px;
    height: 36px;
  }

  .ProseMirror {
    margin: 1rem;
    box-shadow: 0 0 40px rgba(var(--primary), 1);
    outline: none;

    *::selection {
      color: var(--light);
      background: var(--primary);
    }

    p, li, a {
      line-height: 1.2em;
      font-size: 1rem;
    }

    pre {
      padding: 1em;
      border-radius: 5px;
      background: var(--dark);
      color: var(--primary-light);
      font-size: .8rem;
      overflow-x: auto;
      line-height: 1.4em;
    }

    p code {
      display: inline-block;
      padding: .1em 0.4em;
      border-radius: 5px;
      font-size: .8em;
      font-weight: bold;
      background: #CFD8DC;
      color: #263238;
      font-weight: normal;
    }

    blockquote {
      border-left: 3px solid var(--primary);
      color: var(--gray);
      padding-left: 0.8rem;
      font-style: italic;
      margin: 1rem;

      p {
        margin: 0;
      }
    }

    img {
      max-width: 100%;
      border-radius: 3px;
    }

    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;

      td, th {
        min-width: 1em;
        border: 1px solid var(--gray);
        padding: 3px 5px;
        line-height: 1rem;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;

        p {
          margin: 2px;
        }
      }

      th {
        font-weight: bold;
        text-align: left;
      }

      .selectedCell:after {
        z-index: 2;
        position: absolute;
        content: "";
        left: 0; right: 0; top: 0; bottom: 0;
        background: var(--primary-faded);
        pointer-events: none;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: -2px;
        bottom: -2px;
        width: 4px;
        z-index: 20;
        background-color: var(--primary);
        pointer-events: none;

        &:hover {
          cursor: ew-resize;
          cursor: col-resize;
        }
      }
    }

    .tableWrapper {
      margin: 1em 0;
      overflow-x: auto;
    }

    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }

  .menububble {
    position: absolute;
    display: flex;
    z-index: 20;
    margin-bottom: 0.5rem;
    transform: translateX(-50%);
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;

    &.is-active {
      opacity: 1;
      visibility: visible;
    }

    &__button {
      display: inline-flex;
      background: transparent;
      border: 0;
      color: -var(--light);
      padding: 0.2rem 0.5rem;
      margin-right: 0.2rem;
      border-radius: 3px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        background-color: rgba(var(--primary), 0.1);
      }

      &.is-active {
        background-color: rgba(var(--primary), 0.2);
      }
    }

    &__form {
      display: flex;
      align-items: center;
    }

    &__input {
      font: inherit;
      border: none;
      background: transparent;
      color: var(--light);
    }
  }
}
</style>
