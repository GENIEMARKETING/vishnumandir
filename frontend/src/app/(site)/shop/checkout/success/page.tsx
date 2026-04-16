import { CheckoutSuccessClient } from "./CheckoutSuccessClient";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const sp = await searchParams;
  return <CheckoutSuccessClient sessionId={sp.session_id} />;
}

