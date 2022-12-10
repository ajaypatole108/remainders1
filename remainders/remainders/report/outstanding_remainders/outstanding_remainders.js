// Copyright (c) 2022, ajay patole and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Outstanding Remainders"] = {
	"filters": [
		{
			"fieldname": "company",
			"label": __("Company"),
			"fieldtype": "Link",
			"options": "Company",
			"reqd": 1,
			"default": frappe.defaults.get_user_default("Company")
		},
		{
			"fieldname": "report_date",
			"label": __("report_date"),
			"fieldtype": "Date",
			"default": frappe.datetime.get_today()
		},
		{
			"fieldname": "customer",
			"label": __("Customer"),
			"fieldtype": "Link",
			"options":"Customer",
		},
	],

	// onload: function(report) {
	// 	report.page.add_inner_button(__("Accounts Receivable Summary"), function() {
	// 		var filters = report.get_values();
	// 		// frappe.set_route('query-report', 'Accounts Receivable Summary', {company: filters.company});
	// 	});
	// }
};
