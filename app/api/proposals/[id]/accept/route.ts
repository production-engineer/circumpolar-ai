import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProposal } from "@/lib/proposals";
import { Resend } from "resend";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const proposal = getProposal(params.id);
  if (!proposal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { signerName, signerTitle } = await request.json();
  if (!signerName?.trim()) {
    return NextResponse.json({ error: "Signer name required" }, { status: 400 });
  }

  const acceptedAt = new Date().toISOString();
  const signerEmail = session.user.email ?? "unknown";

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "proposals@circumpolar.ai",
      to: ["erik@beaded.cloud"],
      replyTo: signerEmail,
      subject: `✅ Proposal accepted: ${proposal.title} — ${proposal.to.name}`,
      text: [
        `Proposal #${proposal.number} has been accepted.`,
        "",
        `Signer: ${signerName}${signerTitle ? ` (${signerTitle})` : ""}`,
        `Email: ${signerEmail}`,
        `Auth: ${session.user.name ?? "unknown"} via OAuth`,
        `Company: ${proposal.to.name}`,
        `Accepted at: ${acceptedAt}`,
        "",
        `Proposal: ${proposal.title}`,
        `Rate: ${proposal.priceLabel}${proposal.pricePeriod}`,
      ].join("\n"),
    });

    await resend.emails.send({
      from: "proposals@circumpolar.ai",
      to: [signerEmail],
      subject: `Proposal accepted: ${proposal.title}`,
      text: [
        `Hi ${signerName},`,
        "",
        `You've accepted proposal #${proposal.number}: ${proposal.title}.`,
        "",
        `Rate: ${proposal.priceLabel}${proposal.pricePeriod}`,
        `Accepted: ${new Date(acceptedAt).toLocaleString()}`,
        "",
        `Erik will be in touch within 1 business day to set up payment and agree on a start date.`,
        "",
        `— Circumpolar.ai`,
      ].join("\n"),
    });
  }

  return NextResponse.json({
    ok: true,
    acceptedAt,
    stripePaymentLink: proposal.stripePaymentLink,
  });
}
