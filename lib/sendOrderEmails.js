import { resend } from "./resend";


export async function sendCustomerEmail(
    order,
    customerEmail,
    pdfBuffer
) {
    console.log(
        "Customer email:",
        customerEmail
    );
    console.log("ENTERED sendCustomerEmail");
    const itemsHtml =
        order.items.map(
            item => `
      <li>
        ${item.name}
        × ${item.qty}

        ${item.discountPercent > 0
                    ? `
            <br/>
            Original:
            ₹${item.originalPrice}

            <br/>

            Discount:
            ${item.discountPercent}% OFF

            <br/>

            Final:
            ₹${item.finalPrice}
          `
                    : `
            ₹${item.finalPrice}
          `
                }

      </li>
    `
        ).join("");
    console.log(
        "Sending customer email to:",
        customerEmail
    );

    const customerResult = await resend.emails.send({

        from:
            "onboarding@resend.dev",

        to:
            customerEmail,

        subject:
            "Order Confirmed 🎉",

        html: `
<h2>
Order Confirmed 🎉
</h2>

<p>
Invoice Attached
</p>

<p>
Order ID:
${order._id}
</p>

<p>
Invoice Number:
${order.invoiceNumber}
</p>

<p>
Customer:
${order.customerName}
</p>

<p>
Payment Method:
${order.paymentMethod}
</p>

<p>
Total:
₹${order.total}
</p>

<h3>Items</h3>

<ul>
${itemsHtml}
</ul>
<h3>Order Summary</h3>

<p>Original Amount: ₹${order.originalAmount}</p>

<p>Discount: ₹${order.discountAmount}</p>

<p>Taxable Amount: ₹${order.taxableAmount}</p>

${order.cgst > 0
                ? `<p>CGST: ₹${order.cgst}</p>`
                : ""}

${order.sgst > 0
                ? `<p>SGST: ₹${order.sgst}</p>`
                : ""}

${order.igst > 0
                ? `<p>IGST: ₹${order.igst}</p>`
                : ""}

<p>Shipping: ₹${order.shippingCost}</p>

<p><b>Total: ₹${order.total}</b></p>

<h3>Shipping Address</h3>

<p>
${order.addressSnapshot.streetAddress}
<br/>
${order.addressSnapshot.city}
<br/>
${order.addressSnapshot.state}
</p>
`,

        attachments: [
            {
                filename:
                    `${order.invoiceNumber}.pdf`,
                content:
                    pdfBuffer
            }
        ]
    });
    console.log(
        "CUSTOMER RESULT:",
        customerResult
    );
}

export async function sendAdminEmail(
    order,
    customerEmail,
    pdfBuffer
) {
    const itemsHtml =
        order.items.map(
            item => `
      <li>
        ${item.name}
        × ${item.qty}

        ${item.discountPercent > 0
                    ? `
            <br/>
            Original:
            ₹${item.originalPrice}

            <br/>

            Discount:
            ${item.discountPercent}% OFF

            <br/>
           
            Final:
            ₹${item.finalPrice}
          `
                    : `
            ₹${item.finalPrice}
          `
                }

      </li>
    `
        ).join("");
    const adminResult = await resend.emails.send({

        from:
            "onboarding@resend.dev",

        to:
            process.env.ADMIN_EMAIL,

        subject:
            "New Order Received",

        html: `
<h2>
NEW ORDER RECEIVED
</h2>

<p>
Customer:
${order.customerName}
</p>

<p>
Email:
${order.customerEmail}
</p>

<p>
Phone:
${order.addressSnapshot.mobile}
</p>

<p>
Invoice:
${order.invoiceNumber}
</p>

<p>
Order ID:
${order._id}
</p>

<p>
Total:
₹${order.total}
</p>

<h3>Address</h3>

<p>
${order.addressSnapshot.streetAddress}
<br/>
${order.addressSnapshot.city}
<br/>
${order.addressSnapshot.state}
</p>

<h3>Items</h3>

<ul>
${itemsHtml}
</ul>
<h3>Order Summary</h3>

<p>Original Amount: ₹${order.originalAmount}</p>

<p>Discount: ₹${order.discountAmount}</p>

<p>Taxable Amount: ₹${order.taxableAmount}</p>

${order.cgst > 0
                ? `<p>CGST: ₹${order.cgst}</p>`
                : ""}

${order.sgst > 0
                ? `<p>SGST: ₹${order.sgst}</p>`
                : ""}

${order.igst > 0
                ? `<p>IGST: ₹${order.igst}</p>`
                : ""}

<p>Shipping: ₹${order.shippingCost}</p>

<p><b>Total: ₹${order.total}</b></p>

<p>
Invoice Attached
</p>
`,

        attachments: [
            {
                filename:
                    `${order.invoiceNumber}.pdf`,
                content: pdfBuffer
            }
        ]
    });
    console.log(
        "ADMIN RESULT:",
        adminResult
    );
}
export async function sendOrderStatusEmail(
    order
) {


    const statusMessages = {

        shipped: {
            subject:
                "Your Order Has Been Shipped 📦",

            title:
                "Order Shipped",

            message:
                "Your order has been shipped and is on the way."
        },

        delivered: {
            subject:
                "Order Delivered ✅",

            title:
                "Order Delivered",

            message:
                "Your order has been delivered successfully."
        },

        cancelled: {
            subject:
                "Order Cancelled ❌",

            title:
                "Order Cancelled",

            message:
                "Your order has been cancelled."
        },

        returned: {
            subject:
                "Order Returned ↩️",

            title:
                "Order Returned",

            message:
                "Your order has been marked as returned."
        }

    };

    const current =
        statusMessages[
        order.status
        ];

    if (!current) return;

    const itemsHtml =
        order.items.map(
            item => `
      <li>
        ${item.name}
        × ${item.qty}

        ${item.discountPercent > 0
                    ? `
            <br/>
            Original:
            ₹${item.originalPrice}

            <br/>

            Discount:
            ${item.discountPercent}% OFF

            <br/>

            Final:
            ₹${item.finalPrice}
          `
                    : `
            ₹${item.finalPrice}
          `
                }

      </li>
    `
        ).join("");


    await resend.emails.send({

        from:
            "onboarding@resend.dev",

        to:
            order.customerEmail,

        subject:
            current.subject,

        html: `
        

<div style="
font-family: Arial;
max-width: 600px;
margin: auto;
padding: 24px;
border: 1px solid #e5e5e5;
border-radius: 16px;
">

<h1 style="
font-size: 28px;
margin-bottom: 12px;
">
${current.title}
</h1>

<p style="
font-size: 16px;
color: #555;
margin-bottom: 24px;
">
${current.message}
</p>

<div style="
background: #f7f7f7;
padding: 20px;
border-radius: 12px;
margin-bottom: 24px;
">

<p>
<b>Order ID:</b>
${order._id}
</p>

<p>
<b>Invoice Number:</b>
${order.invoiceNumber}
</p>

<p>
<b>Status:</b>
${order.status}
</p>

<p>
<b>Total:</b>
₹${order.total}
</p>

</div>

<h2>
Items
</h2>

<ul>
${itemsHtml}
</ul>
<h3>Order Summary</h3>

<p>Original Amount: ₹${order.originalAmount}</p>

<p>Discount: ₹${order.discountAmount}</p>

<p>Taxable Amount: ₹${order.taxableAmount}</p>

${order.cgst > 0
                ? `<p>CGST: ₹${order.cgst}</p>`
                : ""}

${order.sgst > 0
                ? `<p>SGST: ₹${order.sgst}</p>`
                : ""}

${order.igst > 0
                ? `<p>IGST: ₹${order.igst}</p>`
                : ""}

<p>Shipping: ₹${order.shippingCost}</p>

<p><b>Total: ₹${order.total}</b></p>
<h2>
Shipping Address
</h2>

<p>
${order.addressSnapshot.streetAddress}
<br/>
${order.addressSnapshot.city}
<br/>
${order.addressSnapshot.state}
</p>

<p style="
margin-top: 32px;
font-size: 14px;
color: #777;
">
Thank you for shopping with us.
</p>

</div>
`


    });


}
