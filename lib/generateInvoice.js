import PDFDocument from "pdfkit/js/pdfkit.standalone";

export async function generateInvoice(order) {
    console.log("PDF GENERATION STARTED");
    return new Promise((resolve) => {

        const doc =
            new PDFDocument({
                margin: 50
            });
        // const fontPath = path.join(
        //     process.cwd(),
        //     "public",
        //     "fonts",
        //     "Roboto-Regular.ttf"
        // );

        // doc.font(fontPath);

        const buffers = [];

        doc.on(
            "data",
            buffers.push.bind(buffers)
        );

        doc.on(
            "end",
            () => {
                resolve(
                    Buffer.concat(buffers)
                );
            }
        );

        // COMPANY

        doc
            .fontSize(24)
            .text(
                "YOUR STORE NAME",
                {
                    align: "center"
                }
            );

        doc.moveDown();

        doc
            .fontSize(18)
            .text(
                "INVOICE",
                {
                    align: "center"
                }
            );

        doc.moveDown();

        // INVOICE INFO

        doc.fontSize(12);

        doc.text(
            `Invoice Number: ${order.invoiceNumber}`
        );

        doc.text(
            `Invoice Date: ${new Date(
                order.createdAt
            ).toLocaleString()}`
        );

        doc.text(
            `Order ID: ${order._id}`
        );

        doc.moveDown();

        // CUSTOMER

        doc.fontSize(14);

        doc.text(
            "Customer Details"
        );

        doc.moveDown(0.5);

        doc.fontSize(12);

        doc.text(
            `Name: ${order.customerName}`
        );

        doc.text(
            `Email: ${order.customerEmail}`
        );

        doc.text(
            `Phone: ${order.addressSnapshot.mobile}`
        );

        doc.moveDown();

        // ADDRESS

        doc.fontSize(14);

        doc.text(
            "Shipping Address"
        );

        doc.moveDown(0.5);

        doc.fontSize(12);

        doc.text(
            `${order.addressSnapshot.firstName}
${order.addressSnapshot.lastName}`
        );

        doc.text(
            order.addressSnapshot.streetAddress
        );

        doc.text(
            `${order.addressSnapshot.city},
${order.addressSnapshot.state}`
        );

        doc.moveDown();

        // ITEMS

        doc.fontSize(14);

        doc.text("Items");

        doc.moveDown();

        order.items.forEach(item => {

            doc.text(
                `${item.name}
Qty: ${item.qty}
Price: ₹${item.finalPrice}
Subtotal: ₹${item.finalPrice * item.qty}`
            );

            doc.moveDown();
        });

        doc.moveDown();

        // TOTALS

        const subtotal =
            order.items.reduce(
                (acc, item) =>
                    acc +
                    item.finalPrice * item.qty,
                0
            );

        doc.text(
            `Subtotal: ₹${subtotal}`
        );
        doc.text(
            `Taxable Amount: ₹${order.taxableAmount}`
        );

        if (order.cgst > 0) {
            doc.text(
                `CGST (9%): ₹${order.cgst}`
            );

            doc.text(
                `SGST (9%): ₹${order.sgst}`
            );
        }

        if (order.igst > 0) {
            doc.text(
                `IGST (18%): ₹${order.igst}`
            );
        }

        doc.text(
            `Shipping: ₹${order.shippingCost || 0}`
        );

        doc.text(
            `Grand Total: ₹${order.total}`
        );

        // doc.text(
        //     `Shipping: ₹${order.shippingCost || 0}`
        // );

        // doc.text(
        //     `Grand Total: ₹${order.total}`
        // );

        doc.moveDown();

        doc.text(
            `Payment Method:
${order.paymentMethod}`
        );

        doc.text(
            `Order Status:
${order.status}`
        );

        doc.moveDown(2);

        doc.text(
            "Thank you for shopping with us!"
        );

        doc.end();

    });

}