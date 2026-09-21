export const runtime = "nodejs";
import connectDb from "@/db/connectDb";
import User from "@/models/User";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Product from "@/models/Product";
import CheckoutSession
  from "@/models/CheckoutSession";
import { generateInvoice }
  from "@/lib/generateInvoice";
import {
  sendCustomerEmail,
  sendAdminEmail
} from "@/lib/sendOrderEmails";
import cloudinary
  from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body || !body.cart) {
      return Response.json({ error: "Cart missing" }, { status: 400 });
    }

    const { cart, paymentMethod, address } = body;

    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Not logged in" }, { status: 401 });
    }
    const oneMinuteAgo =
      new Date(Date.now() - 60 * 1000);
    console.log("NOW:", new Date());
    const recentOrder =
      await Order.findOne({
        customerEmail: session.user.email,
        createdAt: {
          $gte: oneMinuteAgo
        }
      });


    console.log("ONE MINUTE AGO:", oneMinuteAgo);

    console.log("RECENT ORDER:", recentOrder?.createdAt);
    if (recentOrder) {
      return Response.json(
        {
          error:
            "Please wait a minute before placing another order."
        },
        {
          status: 400
        }
      );
    }
    // const existingLiveOrder =
    //   await Order.findOne({
    //     customerEmail: session.user.email,
    //     status: {
    //       $nin: [
    //         "delivered",
    //         "cancelled",
    //         "returned"
    //       ]
    //     }
    //   });

    // if (existingLiveOrder) {

    //   return Response.json(
    //     {
    //       error:
    //         "You already have a live order in progress."
    //     },
    //     {
    //       status: 400
    //     }
    //   );

    // }


    const user = await User.findOne({ email: session.user.email });

    //  GET ALL PRODUCTS FIRST
    const products = await Product.find({});

    // BUILD ITEMS
    const items = cart.map(item => {
      let foundProduct;

      if (item.id.includes("-")) {
        const [collectionId, seq] = item.id.split("-");

        foundProduct = products.find(
          p =>
            p.collectionId === collectionId &&
            p.sequence === Number(seq)
        );
      } else {
        foundProduct = products.find(
          p => p._id.toString() === item.id
        );
      }

      if (!foundProduct) {
        throw new Error("Product not found: " + item.id);
      }
      const originalPrice =
        Number(foundProduct.price);

      const finalPrice =
        foundProduct.isDiscount
          ? Number(
            foundProduct.discountedPrice
          )
          : originalPrice;

      return {
        id: item.id,
        name: foundProduct.title,
        originalPrice,

        finalPrice,

        discountPercent:
          foundProduct.isDiscount
            ? Number(
              foundProduct.discountPercent || 0
            )
            : 0,
        price: Number(foundProduct.price),
        image: foundProduct.image,
        qty: item.qty
      };
    });
    for (const item of items) {

      if (
        !Number.isInteger(item.qty) ||
        item.qty < 1 ||
        item.qty > 10
      ) {

        throw new Error(
          "Invalid quantity"
        );

      }

    }

    // CALCULATE TOTAL
    // const subtotal = items.reduce(
    //   (acc, item) =>
    //     acc + item.price * item.qty,
    //   0
    // );
    const originalAmount =
      items.reduce(
        (acc, item) =>
          acc +
          item.originalPrice *
          item.qty,
        0
      );

    const subtotal =
      items.reduce(
        (acc, item) =>
          acc +
          item.finalPrice *
          item.qty,
        0
      );

    const discountAmount =
      originalAmount -
      subtotal;
    // const taxableAmount =
    //   subtotal;
    const GST_RATE = 18;

    const taxableAmount =
      Number(
        (
          subtotal /
          (1 + GST_RATE / 100)
        ).toFixed(2)
      );

    // const gstAmount =
    //   Number(
    //     (
    //       subtotal * GST_RATE / 100).toFixed(2)
    //   );
    const gstAmount =
      Number(
        (
          subtotal -
          taxableAmount
        ).toFixed(2)
      );
    const BUSINESS_STATE =
      "West Bengal";

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (
      address.state?.trim().toLowerCase() ===
      BUSINESS_STATE.toLowerCase()
    ) {
      cgst =
        Number(
          (gstAmount / 2).toFixed(2)
        );

      sgst =
        Number(
          (gstAmount / 2).toFixed(2)
        );
    }
    else {
      igst =
        Number(
          gstAmount.toFixed(2)
        );
    }

    const shipping =
      subtotal > 500 ? 0 : 20;
    const total =
      subtotal +
      shipping;

    // const total =
    //   subtotal + shipping;

    // GET ADDRESS FROM FRONTEND
    const addressSnapshot = {
      firstName: body.address.firstName,
      lastName: body.address.lastName,
      streetAddress: body.address.streetAddress,
      city: body.address.city,
      state: body.address.state,
      mobile: body.address.mobile,
    };
    const checkout =
      await CheckoutSession.findOne({
        userId: session.user.id
      });

    if (!checkout) {
      return Response.json(
        {
          error: "Checkout not started"
        },
        {
          status: 403
        }
      );
    }
    if (checkout.step !== 4) {
      return Response.json(
        {
          error:
            "Must complete checkout first"
        },
        {
          status: 403
        }
      );
    }
    const invoiceNumber =
      `INV-${Date.now()}`;
    // CREATE ORDER
    const newOrder = await Order.create({
      userId: user._id,

      customerName: `${body.address.firstName} ${body.address.lastName}`,
      customerEmail: session.user.email,

      items,

      addressSnapshot,

      paymentMethod,
      originalAmount,

      discountAmount,
      cgst,
      sgst,
      igst,
      subtotal,

      total,

      invoiceNumber,

      shippingCost: shipping,

      status: "pending"
    });
    console.log(newOrder);
    let pdfBuffer;

    try {
      pdfBuffer = await generateInvoice(newOrder);
    }
    catch (err) {

      await Order.deleteOne({
        _id: newOrder._id
      });

      throw err;
    }
    const pdfBase64 =
      pdfBuffer.toString("base64");

    const pdfDataUri =
      `data:application/pdf;base64,${pdfBase64}`;
    console.log("Uploading invoice...");
    const uploadResult =
      await cloudinary.uploader.upload(
        pdfDataUri,
        {
          folder: "invoices",
          resource_type: "raw",
          type: "authenticated"
        }
      );
    console.log(uploadResult);
    try {

      await sendCustomerEmail(
        newOrder,
        session.user.email,
        pdfBuffer
      );

      await sendAdminEmail(
        newOrder,
        session.user.email,
        pdfBuffer
      );

    } catch (err) {

      console.error(
        "Email failed:",
        err
      );

    }
    newOrder.invoiceUrl =
      uploadResult.secure_url;
    newOrder.invoiceNumber =
      invoiceNumber;
    newOrder.invoicePublicId =
      uploadResult.public_id;

    await newOrder.save();
    // await CheckoutSession.deleteOne({
    //   _id: checkout._id
    // });

    return Response.json({ success: true, order: newOrder });

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}