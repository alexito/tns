<?php

function tns_theme_preprocess_page(&$vars) {
  // ....
  // Get the entire main menu tree
  $main_menu_tree = menu_tree_all_data('main-menu');

// Add the rendered output to the $main_menu_expanded variable
  $vars['main_menu_expanded'] = menu_tree_output($main_menu_tree);
}

function tns_theme_links__system_main_menu($vars) {
  $class = implode($vars['attributes']['class'], ' ');
  $html = '<ul class="' . $class . '">';
  foreach ($vars['links'] as $key => $link) {
    if (is_numeric($key)) {
      $sub_menu = '';
      $link_class = '';
      $link_title = $link['#title'];
      // Check for sub menu - note I've only checked this for 2 levels
      // it might not work for 3 level menus.
      if (!empty($link['#below'])) {
        $link_class = ' class="dropdown"';
        $link['#attributes']['class'][] = 'dropdown-toggle';
        $link['#attributes']['data-toggle'][] = 'dropdown';
        // And recurse.
        $sub_menu = theme('links__system_main_menu', array('links' => $link['#below'], 'attributes' => array('class' => array('dropdown-menu'))));
        // Add drop down caret.
        $link_title .= '<b class="caret"></b>';
      }

      $html .= '<li' . $link_class . '>' . l($link_title, $link['#href'], array('html' => 'true', 'attributes' => $link['#attributes'])) . $sub_menu . '</li>';
    }
  }
  $html .= '<div class="btn-log">';
  if ($GLOBALS->user->uid === "0" || $GLOBALS->user->uid === 0) {
    $html .= '<a class="navbar-btn btn btn-theme-primary" href="user/login">Entrar</a>';
  } else {
    $html .= '<a class="navbar-btn btn btn-theme-primary" href="user/logout">Salir</a>';
  }

  $html .= '</div></ul>';
  return $html;
}

function tns_theme_region_empty($test_region) {
  $test_empty = true;

  $result = db_query_range('SELECT n.pages, n.visibility FROM {blocks} n WHERE n.region="%s" AND n.theme="%s"', $test_region, $GLOBALS['theme'], 0, 10);
  if (count($result) > 0) {
    while ($node = db_fetch_object($result)) {

      if ($node->visibility < 2) {
        $path = drupal_get_path_alias($_GET['q']);

        // Compare with the internal and path alias (if any).
        $page_match = drupal_match_path($path, $node->pages);
        if ($path != $_GET['q']) {
          $page_match = $page_match || drupal_match_path($_GET['q'], $node->pages);
        }
        // When $block->visibility has a value of 0, the block is displayed on
        // all pages except those listed in $block->pages. When set to 1, it
        // is displayed only on those pages listed in $block->pages.
        $page_match = !($node->visibility xor $page_match);
      } else {
        $page_match = drupal_eval($block->pages);
      }

      if ($page_match)
        $test_empty = false;
    }
  }
  return $test_empty;
}

/**
 * bootstrap_getFieldValue
 *
 * Return the markup value from a field as an array
 * or bool false
 *
 * @param string $nid
 * @param string $fieldName
 * @param string $type
 * @return mixed
 */
function tns_theme_getFieldValue($nid, $fieldName, $type = 'node') {
  $values = field_get_items($type, $nid, $fieldName);
  if (!empty($values)) {
    $output = array();
    foreach ($values as $value) {
      $res = field_view_value($type, $nid, $fieldName, $value);
      $output[] = $res['#markup'];
    }
    return $output;
  } else {
    return false;
  }
}

function tns_theme_textfield($variables) {
  $element = $variables['element'];
  $element['#attributes']['type'] = 'text';
  if (isset($element['#elm_class'])) {
    $element['#attributes']['class'][] = $element['#elm_class'];
  }
  element_set_attributes($element, array('id', 'name', 'value', 'size', 'maxlength', 'class'));
  _form_set_class($element, array('form-text'));

  $extra = '';
  if ($element['#autocomplete_path'] && drupal_valid_path($element['#autocomplete_path'])) {
    drupal_add_library('system', 'drupal.autocomplete');
    $element['#attributes']['class'][] = 'form-autocomplete';

    $attributes = array();
    $attributes['type'] = 'hidden';
    $attributes['id'] = $element['#attributes']['id'] . '-autocomplete';
    $attributes['value'] = url($element['#autocomplete_path'], array('absolute' => TRUE));
    $attributes['disabled'] = 'disabled';
    $attributes['class'][] = 'autocomplete';
    $extra = '<input' . drupal_attributes($attributes) . ' />';
  }

  $output = '<input' . drupal_attributes($element['#attributes']) . ' />';

  return $output . $extra;
}

function tns_theme_password($variables) {
  $element = $variables['element'];
  $element['#attributes']['type'] = 'password';
  if (isset($element['#elm_class'])) {
    $element['#attributes']['class'][] = $element['#elm_class'];
  }
  element_set_attributes($element, array('id', 'name', 'size', 'maxlength'));
  _form_set_class($element, array('form-text'));

  return '<input' . drupal_attributes($element['#attributes']) . ' />';
}

function tns_theme_button($variables) {
  $element = $variables['element'];
  $element['#attributes']['type'] = 'submit';
  if (isset($element['#elm_class'])) {
    $element['#attributes']['class'][] = $element['#elm_class'];
  }
  element_set_attributes($element, array('id', 'name'));

  $element['#attributes']['class'][] = 'form-' . $element['#button_type'];
  if (!empty($element['#attributes']['disabled'])) {
    $element['#attributes']['class'][] = 'form-button-disabled';
  }

  return '<button' . drupal_attributes($element['#attributes']) . ' >' . $element['#value'] . '</button>';
}

function tns_theme_form_element($variables) {
  $element = &$variables['element'];
  // This is also used in the installer, pre-database setup.
  $t = get_t();

  // This function is invoked as theme wrapper, but the rendered form element
  // may not necessarily have been processed by form_builder().
  $element += array(
      '#title_display' => 'before',
  );

  // Add element #id for #type 'item'.
  if (isset($element['#markup']) && !empty($element['#id'])) {
    $attributes['id'] = $element['#id'];
  }
  // Add element's #type and #name as class to aid with JS/CSS selectors.
  $attributes['class'] = array('form-item');
  if (!empty($element['#type'])) {
    $attributes['class'][] = 'form-type-' . strtr($element['#type'], '_', '-');
  }
  if (!empty($element['#name'])) {
    $attributes['class'][] = 'form-item-' . strtr($element['#name'], array(' ' => '-', '_' => '-', '[' => '-', ']' => ''));
  }
  // Add a class for disabled elements to facilitate cross-browser styling.
  if (!empty($element['#attributes']['disabled'])) {
    $attributes['class'][] = 'form-disabled';
  }
  if (!isset($element['nowrapper']) or $element['nowrapper'] === false) {
    $output = '<div' . drupal_attributes($attributes) . '>' . "\n";
  }
  // If #title is not set, we don't display any label or required marker.
  if (!isset($element['#title'])) {
    $element['#title_display'] = 'none';
  }
  $prefix = isset($element['#field_prefix']) ? '<span class="field-prefix">' . $element['#field_prefix'] . '</span> ' : '';
  $suffix = isset($element['#field_suffix']) ? ' <span class="field-suffix">' . $element['#field_suffix'] . '</span>' : '';

  switch ($element['#title_display']) {
    case 'before':
    case 'invisible':
      $output .= ' ' . theme('form_element_label', $variables);
      $output .= ' ' . $prefix . $element['#children'] . $suffix . "\n";
      break;

    case 'after':
      $output .= ' ' . $prefix . $element['#children'] . $suffix;
      $output .= ' ' . theme('form_element_label', $variables) . "\n";
      break;

    case 'none':
    case 'attribute':
      // Output no label and no required marker, only the children.
      $output .= ' ' . $prefix . $element['#children'] . $suffix . "\n";
      break;
  }

  if (!empty($element['#description'])) {
    $output .= '<div class="description">' . $element['#description'] . "</div>\n";
  }
  if (!isset($element['nowrapper']) or $element['nowrapper'] === false) {
    $output .= "</div>\n";
  }
  return $output;
}

/**
 * Custom login box functions
 */
function horizontal_login_block($form) {
  $form['#action'] = url($_GET['q'], array('query' => drupal_get_destination()));
  $form['#validate'] = user_login_default_validators();
  $form['#submit'][] = 'user_login_submit';
  $form['#prefix'] = '<div id="login" class="pull-right">';
  $form['#suffix'] = '<div class="showlogin"></div></div>';
  $form['name'] = array(
      '#type' => 'textfield',
      '#elm_class' => 'input-small',
      '#nowrapper' => true,
      '#maxlength' => USERNAME_MAX_LENGTH,
      '#size' => 15,
      '#required' => TRUE,
      '#default_value' => 'Username',
      '#attributes' => array('onblur' => "if (this.value == '') {this.value = 'Username';}", 'onfocus' => "if (this.value == 'Username') {this.value = '';}"),
  );
  $form['pass'] = array(
      '#type' => 'password',
      '#nowrapper' => true,
      '#maxlength' => 60,
      '#size' => 15,
      '#required' => TRUE,
      '#elm_class' => 'input-small',
      '#attributes' => array('placeholder' => 'Password'),
  );
  $form['submit'] = array(
      '#type' => 'submit',
      '#nowrapper' => true,
      '#value' => t('Sign in'),
      '#elm_class' => 'btn'
  );
  return $form;
}

function login_bar() {
  global $user;
  if ($user->uid == 0) {
    $form = drupal_get_form('horizontal_login_block');
    return render($form);
  } else {
    // you can also integrate other module such as private message to show unread / read messages here
    return '<div id="login"><p class="pull-right"> <a class="logout" href="/user/logout">X</a>' . t('Welcome back ') . ucwords($user->name) . '<p></div>';
  }
}
