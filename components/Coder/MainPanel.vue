<template>
  <div class="flex w-full h-full">
    <div class="h-full" :style="`width: ${codeEditorWidth}`">
      <!-- <VueMonacoEditor
        v-model:value="code"
        :theme="codeEditorTheme"
        language="javascript"
        :options="MONACO_EDITOR_OPTIONS"
      /> -->
      <div id="code-editor" style="height: 100%;" />
    </div>
    <div class="CodeWidthDragger" @drag="(e) => adjustWidth(e)" draggable="true" />
    <div class="flex-1 p-4">
      <h1>{{ $t('page.coder') }}</h1>
      <p>This feature is under development. Stay tuned!</p>
      <p>此功能正在開發中。敬請期待！</p>
      <p class="mt-4">
        <span>Code editor is powered by </span>
        <el-link href="https://www.npmjs.com/package/monaco-editor" target="_blank">monaco-editor</el-link>
        <span>.</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { editor as IEditor } from 'monaco-editor'
// import VueMonacoEditor, { loader, install as VueMonacoEditorPlugins } from '@guolao/vue-monaco-editor'
import * as monaco from 'monaco-editor'

// if (process.client) {
//   loader.config({
//     monaco
//   })
// }

const MONACO_EDITOR_OPTIONS: IEditor.IStandaloneDiffEditorConstructionOptions = {
  automaticLayout: true, 
  formatOnType: true, 
  formatOnPaste: true,
}

const code = ref(`/*
  © Microsoft. All rights reserved.

  This library is supported for use in Windows Tailored Apps only.

  Build: 6.2.8100.0 
  Version: 0.5 
*/

(function (global, undefined) {
  "use strict";
  undefinedVariable = {};
  undefinedVariable.prop = 5;

  function initializeProperties(target, members) {
    var keys = Object.keys(members);
    var properties;
    var i, len;
    for (i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      var enumerable = key.charCodeAt(0) !== /*_*/95;
      var member = members[key];
      if (member && typeof member === 'object') {
        if (member.value !== undefined || typeof member.get === 'function' || typeof member.set === 'function') {
          if (member.enumerable === undefined) {
            member.enumerable = enumerable;
          }
          properties = properties || {};
          properties[key] = member;
          continue;
        } 
      }
      if (!enumerable) {
        properties = properties || {};
        properties[key] = { value: member, enumerable: enumerable, configurable: true, writable: true }
        continue;
      }
      target[key] = member;
    }
    if (properties) {
      Object.defineProperties(target, properties);
    }
  }

  (function (rootNamespace) {

    // Create the rootNamespace in the global namespace
    if (!global[rootNamespace]) {
      global[rootNamespace] = Object.create(Object.prototype);
    }

    // Cache the rootNamespace we just created in a local variable
    var _rootNamespace = global[rootNamespace];
    if (!_rootNamespace.Namespace) {
      _rootNamespace.Namespace = Object.create(Object.prototype);
    }

    function defineWithParent(parentNamespace, name, members) {
      /// <summary locid="1">
      /// Defines a new namespace with the specified name, under the specified parent namespace.
      /// </summary>
      /// <param name="parentNamespace" type="Object" locid="2">
      /// The parent namespace which will contain the new namespace.
      /// </param>
      /// <param name="name" type="String" locid="3">
      /// Name of the new namespace.
      /// </param>
      /// <param name="members" type="Object" locid="4">
      /// Members in the new namespace.
      /// </param>
      /// <returns locid="5">
      /// The newly defined namespace.
      /// </returns>
      var currentNamespace = parentNamespace,
        namespaceFragments = name.split(".");

      for (var i = 0, len = namespaceFragments.length; i < len; i++) {
        var namespaceName = namespaceFragments[i];
        if (!currentNamespace[namespaceName]) {
          Object.defineProperty(currentNamespace, namespaceName, 
            { value: {}, writable: false, enumerable: true, configurable: true }
          );
        }
        currentNamespace = currentNamespace[namespaceName];
      }

      if (members) {
        initializeProperties(currentNamespace, members);
      }

      return currentNamespace;
    }

    function define(name, members) {
      /// <summary locid="6">
      /// Defines a new namespace with the specified name.
      /// </summary>
      /// <param name="name" type="String" locid="7">
      /// Name of the namespace.  This could be a dot-separated nested name.
      /// </param>
      /// <param name="members" type="Object" locid="4">
      /// Members in the new namespace.
      /// </param>
      /// <returns locid="5">
      /// The newly defined namespace.
      /// </returns>
      return defineWithParent(global, name, members);
    }

    // Establish members of the "WinJS.Namespace" namespace
    Object.defineProperties(_rootNamespace.Namespace, {

      defineWithParent: { value: defineWithParent, writable: true, enumerable: true },

      define: { value: define, writable: true, enumerable: true }

    });

  })("WinJS");

  (function (WinJS) {

    function define(constructor, instanceMembers, staticMembers) {
      /// <summary locid="8">
      /// Defines a class using the given constructor and with the specified instance members.
      /// </summary>
      /// <param name="constructor" type="Function" locid="9">
      /// A constructor function that will be used to instantiate this class.
      /// </param>
      /// <param name="instanceMembers" type="Object" locid="10">
      /// The set of instance fields, properties and methods to be made available on the class.
      /// </param>
      /// <param name="staticMembers" type="Object" locid="11">
      /// The set of static fields, properties and methods to be made available on the class.
      /// </param>
      /// <returns type="Function" locid="12">
      /// The newly defined class.
      /// </returns>
      constructor = constructor || function () { };
      if (instanceMembers) {
        initializeProperties(constructor.prototype, instanceMembers);
      }
      if (staticMembers) {
        initializeProperties(constructor, staticMembers);
      }
      return constructor;
    }

    function derive(baseClass, constructor, instanceMembers, staticMembers) {
      /// <summary locid="13">
      /// Uses prototypal inheritance to create a sub-class based on the supplied baseClass parameter.
      /// </summary>
      /// <param name="baseClass" type="Function" locid="14">
      /// The class to inherit from.
      /// </param>
      /// <param name="constructor" type="Function" locid="9">
      /// A constructor function that will be used to instantiate this class.
      /// </param>
      /// <param name="instanceMembers" type="Object" locid="10">
      /// The set of instance fields, properties and methods to be made available on the class.
      /// </param>
      /// <param name="staticMembers" type="Object" locid="11">
      /// The set of static fields, properties and methods to be made available on the class.
      /// </param>
      /// <returns type="Function" locid="12">
      /// The newly defined class.
      /// </returns>
      if (baseClass) {
        constructor = constructor || function () { };
        var basePrototype = baseClass.prototype;
        constructor.prototype = Object.create(basePrototype);
        Object.defineProperty(constructor.prototype, "_super", { value: basePrototype });
        Object.defineProperty(constructor.prototype, "constructor", { value: constructor });
        if (instanceMembers) {
          initializeProperties(constructor.prototype, instanceMembers);
        }
        if (staticMembers) {
          initializeProperties(constructor, staticMembers);
        }
        return constructor;
      } else {
        return define(constructor, instanceMembers, staticMembers);
      }
    }

    function mix(constructor) {
      /// <summary locid="15">
      /// Defines a class using the given constructor and the union of the set of instance members
      /// specified by all the mixin objects.  The mixin parameter list can be of variable length.
      /// </summary>
      /// <param name="constructor" locid="9">
      /// A constructor function that will be used to instantiate this class.
      /// </param>
      /// <returns locid="12">
      /// The newly defined class.
      /// </returns>
      constructor = constructor || function () { };
      var i, len;
      for (i = 0, len = arguments.length; i < len; i++) {
        initializeProperties(constructor.prototype, arguments[i]);
      }
      return constructor;
    }

    // Establish members of "WinJS.Class" namespace
    WinJS.Namespace.define("WinJS.Class", {
      define: define,
      derive: derive,
      mix: mix
    });

  })(WinJS);

})(this);
`)
// @mount="handleMount"
// const editorRef = shallowRef()
// const handleMount = editor => (editorRef.value = editor)
// // your action
// function formatCode() {
//   editorRef.value?.getAction('editor.action.formatDocument').run()
// }

if (process.client) {
  setTimeout(async () => {
    const el = document.querySelector('#code-editor') as HTMLElement
    const editor = monaco.editor.create(el, {
      value: code.value,
      language: "javascript",
      automaticLayout: true,
      theme: 'vs-dark'
    })
  }, 0);
}

const codeEditorWidth = ref('60%')
function adjustWidth (e: MouseEvent) {
  const x = (e.clientX || 0) + ((document.querySelector('.CodeWidthDragger')?.clientWidth || 0) / 2)
  if (x > 320) {
    codeEditorWidth.value = `${100 * x / window.innerWidth}%`
  }
}

const { isDark } = useNuxtApp().$themes
const codeEditorTheme = ref<'vs-dark'|'light'>(isDark.value ? 'vs-dark' : 'light')
watch (isDark, (_isDark) => {
  codeEditorTheme.value = _isDark ? 'vs-dark' : 'light'
})

useTitle(`Home - ${useState('appName').value}`)
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.CodeWidthDragger {
  width: 10px;
  transition: .3s ease-in-out;
}
.CodeWidthDragger:hover {
  cursor: col-resize !important;
  background: #80808080;
}
</style>
