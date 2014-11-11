<?php
function bootstrap_form_system_theme_settings_alter(&$form, &$form_state) {
	$form['bootstrap_settings']['google'] = array(
	    '#type' => 'fieldset',
	    '#title' => t('Google Analytics settings')
	   );
	$form['bootstrap_settings']['google']['ga_use'] = array(
		'#type' => 'checkbox',
		'#title' => t('Use Google analytics'),
		'#default_value' => theme_get_setting('ga_use'),
	);
	$form['bootstrap_settings']['google']['ga_ua'] = array(
		'#type' => 'textfield',
		'#title' => t('UA id'),
		'#description'   => t("Add the Google Analytics id (UA-1234567-8) to add analytics to the theme"),
		'#default_value' => theme_get_setting('ga_ua'),
	);
	$form['bootstrap_settings']['google']['ga_login'] = array(
		'#type' => 'checkbox',
		'#title' => t('Use analytics on users how is logged in'),
		'#default_value' => theme_get_setting('ga_login'),
	);
	$form['bootstrap_settings']['menusitename'] = array(
	    '#type' => 'fieldset',
	    '#title' => t('Site name in menu')
	);
	$form['bootstrap_settings']['menusitename']['rsnm'] = array(
		'#type' => 'checkbox',
		'#title' => t('Remove site name from menu'),
		'#default_value' => theme_get_setting('rsnm'),
	);
}