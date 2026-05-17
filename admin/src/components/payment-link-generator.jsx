"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { IconCopy, IconLink } from "@tabler/icons-react";

export function PaymentLinkGenerator() {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please provide a client email");
      return;
    }

    try {
      setLoading(true);
      setLink("");

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      const response = await fetch(`${apiUrl}/payments/generate-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount ? Number(amount) : undefined,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate link");
      }

      if (data.paymentUrl) {
        setLink(data.paymentUrl);
        try {
          await navigator.clipboard.writeText(data.paymentUrl);
          toast.success("Link generated and copied to clipboard!");
        } catch (copyError) {
          console.warn("Auto-copy failed:", copyError);
          toast.success(amount ? "Specific amount link generated!" : "Open amount link generated!");
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (link) {
      navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><IconLink className="w-5 h-5" /> Generate Payment Link</CardTitle>
        <CardDescription>Create a Paystack link. Leave amount blank for an open payment.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerate} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (KES) - Leave blank for open amount</Label>
            <Input 
              id="amount" 
              type="number" 
              placeholder="e.g. 5000 (optional)" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Client Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="client@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Client Phone (Optional)</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="e.g. +254700000000" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Generating Link..." : "Generate Link"}
          </Button>
        </form>

        {loading && (
          <div className="mt-4 p-3 border border-dashed rounded-lg text-center text-sm text-muted-foreground animate-pulse">
            Talking to Paystack... please wait.
          </div>
        )}

        {link && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
            <Label className="text-sm font-semibold text-primary flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Payment Link Ready
            </Label>
            <div className="flex items-center gap-2">
              <Input value={link} readOnly className="bg-background font-mono text-xs border-primary/20" />
              <Button onClick={copyToClipboard} size="sm" className="flex-shrink-0 shadow-sm">
                <IconCopy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Share this link with your client to receive payment.
            </p>
          </div>
        )}

        {!link && !loading && (
          <p className="mt-4 text-[10px] text-center text-muted-foreground">
            The link will appear here once generated.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
