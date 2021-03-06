/*
 +-----------------------------------------------------------------------+
 | RoundCube editor js library                                           |
 |                                                                       |
 | This file is part of the RoundCube web development suite              |
 | Copyright (C) 2006, RoundCube Dev, - Switzerland                      |
 | Licensed under the GNU GPL                                            |
 |                                                                       |
 +-----------------------------------------------------------------------+
 | Author: Eric Stadtherr <estadtherr@gmail.com>                         |
 +-----------------------------------------------------------------------+

 $Id: editor.js 000 2006-05-18 19:12:28Z roundcube $
*/

// Initialize HTML editor
function rcmail_editor_init(
  skin_path, editor_lang,
  spellcheck,
  mode,
  theme,
  plugins,
  toolbar_location,
  toolbar_align,
  toolbar_buttons1,
  toolbar_buttons2,
  toolbar_buttons3,
  toolbar_buttons1_add_before,
  toolbar_buttons2_add_before,
  toolbar_buttons3_add_before
  )
{
  if (mode == 'identity'){ // html signature
   tinyMCE.init({
      mode : 'textareas',
      editor_selector : 'mce_editor',
      apply_source_formatting : true,
      theme : theme,
      language : editor_lang,
      plugins : plugins,
      content_css : skin_path + '/editor_content.css',
      theme_advanced_toolbar_location : toolbar_location,
      theme_advanced_toolbar_align : toolbar_align,
      theme_advanced_buttons1 : toolbar_buttons1,
      theme_advanced_buttons2 : toolbar_buttons2,
      theme_advanced_buttons3 : toolbar_buttons3,
      theme_advanced_buttons1_add_before : toolbar_buttons1_add_before,
      theme_advanced_buttons2_add_before : toolbar_buttons2_add_before,
      theme_advanced_buttons3_add_before : toolbar_buttons3_add_before,
      relative_urls : false,
      remove_script_host : false,
      //force_br_newlines : false, // http://wiki.moxiecode.com/index.php/TinyMCE:Configuration/force_br_newlines
      //forced_root_block : '' // Needed for 3.x
      gecko_spellcheck : true
    });
  }
  else{ // mail compose
  tinyMCE.init({
      mode : 'textareas',
      editor_selector : 'mce_editor',
      accessibility_focus : false,
      apply_source_formatting : true,
      theme : theme,
      language : editor_lang,
      plugins : plugins,
      theme_advanced_toolbar_location : toolbar_location,
      theme_advanced_toolbar_align : toolbar_align,
      theme_advanced_buttons1 : toolbar_buttons1,
      theme_advanced_buttons2 : toolbar_buttons2,
      theme_advanced_buttons3 : toolbar_buttons3,
      theme_advanced_buttons1_add_before : toolbar_buttons1_add_before,
      theme_advanced_buttons2_add_before : toolbar_buttons2_add_before,
      theme_advanced_buttons3_add_before : toolbar_buttons3_add_before,
      extended_valid_elements : 'font[face|size|color|style],span[id|class|align|style]',
      content_css : skin_path + '/editor_content.css',
      external_image_list_url : 'program/js/editor_images.js',
      spellchecker_languages : (rcmail.env.spellcheck_langs ? rcmail.env.spellcheck_langs : 'Dansk=da,Deutsch=de,+English=en,Espanol=es,Francais=fr,Italiano=it,Nederlands=nl,Polski=pl,Portugues=pt,Suomi=fi,Svenska=sv'),
      gecko_spellcheck : true,
      relative_urls : false,
      remove_script_host : false,
      rc_client: rcmail,
      oninit : 'rcmail_editor_callback'
    });
  }
}

// react to real individual tinyMCE editor init
function rcmail_editor_callback(editor)
{
  var input_from = rcube_find_object('_from');
  if (input_from && input_from.type=='select-one')
    rcmail.change_identity(input_from);
  // set tabIndex
  rcmail_editor_tabindex()
}

// set tabIndex on tinyMCE editor
function rcmail_editor_tabindex()
{
  if (rcmail.env.task == 'mail') {
    var editor = tinyMCE.get(rcmail.env.composebody);
    var textarea = editor.getElement();
    var node = editor.getContentAreaContainer().childNodes[0];
    if (textarea && node)
      node.tabIndex = textarea.tabIndex;
  }
}

// switch html/plain mode
function rcmail_toggle_editor(ishtml, textAreaId, flagElement)
{
  var composeElement = document.getElementById(textAreaId);
  var flag;

  if (ishtml)
    {
    rcmail.display_spellcheck_controls(false);

    rcmail.plain2html(composeElement.value, textAreaId);
    tinyMCE.execCommand('mceAddControl', true, textAreaId);
    rcmail_editor_tabindex();
    if (flagElement && (flag = rcube_find_object(flagElement)))
      flag.value = '1';
    }
  else
    {
    if (!confirm(rcmail.get_label('editorwarning')))
      return false;

    var thisMCE = tinyMCE.get(textAreaId);
    var existingHtml = thisMCE.getContent();
    rcmail.html2plain(existingHtml, textAreaId);
    tinyMCE.execCommand('mceRemoveControl', true, textAreaId);
    rcmail.display_spellcheck_controls(true);
    if (flagElement && (flag = rcube_find_object(flagElement)))
      flag.value = '0';
    }
};
