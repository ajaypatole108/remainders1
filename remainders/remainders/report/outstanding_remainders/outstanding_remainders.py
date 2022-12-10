# Copyright (c) 2022, ajay patole and contributors
# For license information, please see license.txt

from collections import OrderedDict

import frappe
from frappe import _, qb, scrub
from frappe.query_builder import Criterion
from frappe.query_builder.functions import Date
from frappe.utils import cint, cstr, flt, getdate, nowdate
# import os
 
def execute(filters=None):
	return get_columns(), get_data(filters)

def get_data(filters):
	print(f"\n\n\n{filters}\n\n\n")
	
	condition = " 1=1 "
	if(filters.customer):condition += f" AND customer = '{filters.customer}' "
	print(condition)

	data = frappe.db.sql(f"""
							SELECT UNIQUE si.name,si.posting_date,si.customer,si.po_no,si.po_date,si.due_date,si.base_rounded_total,si.outstanding_amount,
							(SELECT -(rounded_total) FROM `tabSales Invoice` cnsi WHERE cnsi.return_against = si.name) AS cn_amount
							FROM
							`tabSales Invoice` si
							LEFT JOIN
							`tabPayment Entry Reference` per
							ON
							si.name = per.reference_name
							WHERE
							{condition}
							AND
							si.outstanding_amount > 0
							AND
							si.status != 'Draft' AND si.status != 'Cancelled'
							AND
							si.status != 'Paid'
							ORDER BY si.posting_date
							""",as_dict=1)
	# print('data: ',data)

	condition1 = " 1=1 "
	if(filters.customer):condition1 += f" AND party_name = '{filters.customer}'"
	print(condition1)
	data1 = frappe.db.sql(f"""
							SELECT pe.name, pe.party_name as customer,pe.posting_date,pe.unallocated_amount as paid_amount
							FROM
							`tabPayment Entry` pe
							WHERE
							{condition1}
							AND
							pe.unallocated_amount != 0
							AND
							pe.status != 'Cancelled'
							ORDER BY pe.posting_date
						""",as_dict=1)
	# print('data1: ',data1)
 
	d = []
	if len(data) != 0:
		for i in data:
			doc1 = frappe.get_doc('Sales Invoice',i.name)
			age1 = (getdate(nowdate()) - getdate(doc1.posting_date)).days
			i['age'] = age1
			d.append(i)  # return dictionary {} but it want list so added into list d [{},{}]

	if len(data1) != 0:
		for i in data1:
			print('i',i)
			doc1 = frappe.get_doc('Payment Entry',i.name)
			i['outstanding_amount'] = -(doc1.unallocated_amount)
			d.append(i)
	print('d: ',d)
	return d

def get_columns():
	return [
		 {
            'fieldname': 'name',
            'label': _('Invoice No'),
            'fieldtype': 'Link',
			"options": 'Sales Invoice',
			'width' : '100'
        },
		{
            'fieldname': 'posting_date',
            'label': _('Invoice Date'),
            'fieldtype': 'Date',
			'width' : '105'
        },
		{
            'fieldname': 'customer',
            'label': _('Customer'),
            'fieldtype': 'Link',
			"options": "Customer",
			'width' : '100'	
        },
		{
            'fieldname': 'po_no',
            'label': _('PO Number'),
            'fieldtype': 'Data',
			'width' : '100'	
        },
		{
            'fieldname': 'po_date',
            'label': _('PO Date'),
            'fieldtype': 'Data',
			'width' : '100'
        },
		{
            'fieldname': 'due_date',
            'label': _('Due Date'),
            'fieldtype': 'Date',
			'width' : '100'
        },
		{
            'fieldname': 'age',
            'label': _('Age'),
            'fieldtype': 'Int',
			'width' : '100'
        },
		{
            'fieldname': 'base_rounded_total',
            'label': _('Invoice Amount'),
            'fieldtype': 'Currency',
			'width' : '150'
        },
		{
            'fieldname': 'paid_amount',
            'label': _('Paid Amount'),
            'fieldtype': 'Currency',
			'width' : '150'
        },
		{
            'fieldname': 'cn_amount',
            'label': _('Credit Note'),
            'fieldtype': 'Currency',
			'width' : '150'
        },
		{
            'fieldname': 'outstanding_amount',
            'label': _('Outstanding'),
            'fieldtype': 'Currency',
			'width' : '150'
        },
	]

