# Copyright (c) 2026, Haseeb and contributors
# License: MIT. See LICENSE

import frappe
from frappe.desk.doctype.global_search_settings.global_search_settings import (
	update_global_search_doctypes,
)
from frappe.utils.dashboard import sync_dashboards


def _(x, *args, **kwargs):
	"""Return untranslated labels for fixture creation."""
	return x


def install():
	update_genders()
	update_salutations()
	update_global_search_doctypes()
	sync_dashboards()
	add_unsubscribe()


def update_genders():
	for gender in (
		_("Male"),
		_("Female"),
		_("Other"),
		_("Transgender"),
		_("Genderqueer"),
		_("Non-Conforming"),
		_("Prefer not to say"),
	):
		doc = frappe.new_doc("Gender")
		doc.gender = gender
		doc.insert(ignore_permissions=True, ignore_if_duplicate=True)


def update_salutations():
	for salutation in (
		_("Mr"),
		_("Ms"),
		_("Mx"),
		_("Dr"),
		_("Mrs"),
		_("Madam"),
		_("Miss"),
		_("Master"),
		_("Prof"),
	):
		doc = frappe.new_doc("Salutation")
		doc.salutation = salutation
		doc.insert(ignore_permissions=True, ignore_if_duplicate=True)


def add_unsubscribe():
	for unsubscribe in (
		{"email": "admin@example.com", "global_unsubscribe": 1},
		{"email": "guest@example.com", "global_unsubscribe": 1},
	):
		if not frappe.get_all("Email Unsubscribe", filters=unsubscribe):
			doc = frappe.new_doc("Email Unsubscribe")
			doc.update(unsubscribe)
			doc.insert(ignore_permissions=True)
