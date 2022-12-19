
function dispatch(data) {
    frappe.call({
        method: "remainders.remainder_automation.outstanding.fetch_dispatch_data",
        args: {
            name: data
        },
        callback: function (r) { 
            if (r.message){
                // console.log(r.message)
                let d = new frappe.ui.Dialog({
                    title: 'Enter Dispatch details',
                    fields: [
                        {
                            label: 'Sales Order Link',
                            fieldname: 'link',
                            fieldtype: 'Link',
                            default:'https://erp.dhupargroup.com/app/sales-order/' + `${r.message.name}`,
                            read_only:1,
                            hidden:1
                        },
                        {
                            label: 'Sales Order Number',
                            fieldname: 'name',
                            fieldtype: 'Data',
                            default: `${r.message.name}`,
                            read_only:1
                        },
                        {
                            label: 'Customer',
                            fieldname: 'customer',
                            fieldtype: 'Data',
                            default: `${r.message.customer}`,
                            read_only:1
                        },
                        {
                            label: 'Date',
                            fieldname: 'date',
                            fieldtype: 'Date',
                            default: `${r.message.date}`,
                            read_only:1
                        },
                        {
                            label: "Customer's Purchase Order No",
                            fieldname: 'po_no',
                            fieldtype: 'Data',
                            default: `${r.message.po_no}`,
                            read_only:1
                        },
                        {
                            label: 'Customer Contact Person',
                            fieldname: 'contact_person',
                            fieldtype: 'Data',
                            reqd: 1
                        },
                        {
                            label: 'Transport Payment',
                            fieldname: 'transport_payment',
                            fieldtype: 'Select',
                            options: "\nTransporter Paid\nTransporter To Pay\nOur Vehicle/ Rented Vehicle\nCustomer Will Pick",
                        },
                        {   
                            label: 'Delivery Type',
                            fieldname: 'delivery_type',
                            fieldtype: 'Select',
                            options:"\nDoor Delivery\nGodown Delivery",
                            depends_on: 'eval:doc.transport_payment == "Transporter Paid" || doc.transport_payment == "Transporter To Pay"',
                        },
                        {
                            label: 'Customer Vehicle Number and Contact',
                            fieldname: 'customer_vehicle',
                            fieldtype: 'Data',
                            depends_on: 'eval:doc.transport_payment == "Customer Will Pick"',
                        },
                        {
                            label: 'Special Instructions',
                            fieldname: 'special_instructions',
                            fieldtype: 'Data'
                        }
                    ],
                    primary_action_label: 'Send To Trello',
                    primary_action(values) {
                        d.hide();

                        var dispatch_order = async () => {
                            const response = await fetch('https://n8n.dhupargroup.com/webhook/865fd238-9558-48f8-a0c6-079a33f6d8a3', {
                              method: 'POST',
                              body: JSON.stringify(values),
                              headers: {
                                "Content-Type": "application/json",
                              }
                            });
                        }
                        dispatch_order();
                    }
                });
                d.show();
            }
        }
    });
}
