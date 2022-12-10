// frappe.ui.form.on("Sales Order", {
// 	customer_name: function(frm) {
// 		let customer_name = frm.doc.customer;

// 		if (customer_name) {
// 			frappe.call({
// 				method:"remainders.remainder_automation.outstanding.check_email_id",
// 				args:{
// 					"source_name":customer_name,
// 				}
// 			}).done((r) => {
// 				frm.doc.billing_email_id = r.message

// 				refresh_field('billing_email_id')
// 			})
// 		}
// 	}
// });



frappe.ui.form.on("Sales Order", {
	after_save(frm) {
        frappe.call({
            method:"remainders.remainder_automation.outstanding.update_email_id",
            args: {
                "customer_name1": frm.doc.customer,
				"email_id":frm.doc.billing_email_id
            },
            callback : function(r) {
               if (r.message){
                    console.log(r.message)
               }
            },
        })
	}
});
