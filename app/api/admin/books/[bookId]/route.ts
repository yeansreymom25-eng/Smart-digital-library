import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const body = await request.json() as {
      title: string;
      author: string;
      category: string;
      libraryType: string;
      type: string;
      status: string;
      price: string;
      pdfName: string;
      coverImageSrc: string;
      paymentQrImageSrc: string;
    };

    const { error } = await supabase
      .from("books")
      .update({
        title: body.title,
        author: body.author,
        category: body.category,
        library_type: body.libraryType,
        type: body.type,
        status: body.status,
        price: body.price,
        pdf_url: body.pdfName,
        cover_url: body.coverImageSrc,
        payment_qr_url: body.paymentQrImageSrc,
      })
      .eq("id", bookId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const { error } = await supabase.from("books").delete().eq("id", bookId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}