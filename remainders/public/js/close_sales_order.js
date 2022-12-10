frappe.provide("erpnext");

$.extend(erpnext, {
    close_so: function (data) {
        frappe.call({
            method: "erpnext.selling.doctype.sales_order.sales_order.update_status",
            args: {
                status: "Closed",
                name: data
            },
            callback: function (r) {
                frappe.msgprint("closed " + data);
            }
        });
    }
});
