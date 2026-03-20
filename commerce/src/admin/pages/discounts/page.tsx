"use client";

import React, { useState, useEffect } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Input,
  Table,
  Badge,
  Select,
  Text,
  Heading,
  Alert,
  Container,
  Modal,
  Label,
  Textarea,
} from "@medusajs/ui";
import { PencilSquare, Trash, Plus, CheckCircle, XCircle } from "@medusajs/icons";

interface Discount {
  id: string;
  code: string;
  type: "FIXED" | "PERCENTAGE";
  value: number;
  display_value: string;
  scope: "PRODUCT" | "ORDER" | "GLOBAL";
  product_ids: string[];
  min_order_amount?: number;
  max_uses?: number;
  used_count: number;
  active: boolean;
  starts_at?: string;
  expires_at?: string;
  created_at: string;
}

interface CreateDiscountForm {
  code: string;
  type: "FIXED" | "PERCENTAGE";
  value: string;
  scope: "PRODUCT" | "ORDER" | "GLOBAL";
  product_ids: string[];
  min_order_amount: string;
  max_uses: string;
  starts_at: string;
  expires_at: string;
}

/**
 * Discount Management Admin Page
 * Complete admin interface for managing promotional discount codes
 */
export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  // Form state
  const [form, setForm] = useState<CreateDiscountForm>({
    code: "",
    type: "FIXED",
    value: "",
    scope: "GLOBAL",
    product_ids: [],
    min_order_amount: "",
    max_uses: "",
    starts_at: "",
    expires_at: "",
  });

  // Fetch discounts on mount
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/admin/discounts?limit=100", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch discounts");
      }

      const data = await response.json();
      setDiscounts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch discounts");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      code: "",
      type: "FIXED",
      value: "",
      scope: "GLOBAL",
      product_ids: [],
      min_order_amount: "",
      max_uses: "",
      starts_at: "",
      expires_at: "",
    });
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code || !form.value) {
      setError("Code and value are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: parseInt(form.value),
        scope: form.scope,
        product_ids: form.product_ids,
        ...(form.min_order_amount && { min_order_amount: parseInt(form.min_order_amount) * 100 }),
        ...(form.max_uses && { max_uses: parseInt(form.max_uses) }),
        ...(form.starts_at && { starts_at: form.starts_at }),
        ...(form.expires_at && { expires_at: form.expires_at }),
      };

      const response = await fetch("/admin/discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create discount");
      }

      const data = await response.json();
      setSuccess("Discount created successfully");
      setDiscounts([data.data, ...discounts]);
      setShowCreateModal(false);
      resetForm();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create discount");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (discountId: string, currentStatus: boolean) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/admin/discounts/${discountId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update discount status");
      }

      setSuccess(`Discount ${!currentStatus ? "activated" : "deactivated"}`);
      setDiscounts(
        discounts.map((d) =>
          d.id === discountId ? { ...d, active: !currentStatus } : d
        )
      );

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update discount");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDiscount = async (discountId: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete discount ${code}?`)) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/admin/discounts/${discountId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete discount");
      }

      setSuccess("Discount deleted successfully");
      setDiscounts(discounts.filter((d) => d.id !== discountId));

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete discount");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <Container className="py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Heading level="h1" className="mb-2">
              Discount Codes
            </Heading>
            <Text className="text-text-disabled">
              Manage promotional discount codes for your store
            </Text>
          </div>
          <Button onClick={() => setShowCreateModal(true)} variant="primary">
            <Plus /> Create Discount
          </Button>
        </div>

        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        {success && <Alert variant="success" className="mb-4">{success}</Alert>}
      </div>

      {loading ? (
        <Text className="text-text-disabled">Loading discounts...</Text>
      ) : discounts.length === 0 ? (
        <Alert variant="warning">
          No discount codes yet. Click "Create Discount" to add one.
        </Alert>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <Table.Header>
              <Table.HeaderRow>
                <Table.HeaderCell>Code</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
                <Table.HeaderCell>Scope</Table.HeaderCell>
                <Table.HeaderCell>Usage</Table.HeaderCell>
                <Table.HeaderCell>Expires</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.HeaderRow>
            </Table.Header>
            <Table.Body>
              {discounts.map((discount) => (
                <Table.Row key={discount.id}>
                  <Table.Cell>
                    <Text className="font-mono font-bold">{discount.code}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge className={discount.type === "FIXED" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}>
                      {discount.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{discount.display_value}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge className="bg-purple-50 text-purple-700">
                      {discount.scope}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>
                      {discount.used_count}
                      {discount.max_uses ? ` / ${discount.max_uses}` : ""}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Text>{formatDate(discount.expires_at)}</Text>
                      {isExpired(discount.expires_at) && (
                        <Badge className="bg-red-50 text-red-700">Expired</Badge>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => handleToggleStatus(discount.id, discount.active)}
                      disabled={saving}
                    >
                      {discount.active ? (
                        <CheckCircle className="text-green-600" />
                      ) : (
                        <XCircle className="text-gray-400" />
                      )}
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => {
                          setEditingDiscount(discount);
                          setShowEditModal(true);
                        }}
                        disabled={saving}
                      >
                        <PencilSquare />
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => handleDeleteDiscount(discount.id, discount.code)}
                        disabled={saving}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* Create Discount Modal */}
      <Modal open={showCreateModal} onOpenChange={setShowCreateModal}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Create Discount Code</Modal.Title>
          </Modal.Header>
          <Modal.Body className="space-y-4">
            <div>
              <Label>Code *</Label>
              <Input
                placeholder="e.g., SAVE10, WELCOME20"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => setForm({ ...form, type: value as "FIXED" | "PERCENTAGE" })}
                >
                  <Select.Item value="FIXED">Fixed ($)</Select.Item>
                  <Select.Item value="PERCENTAGE">Percentage (%)</Select.Item>
                </Select>
              </div>

              <div>
                <Label>Value *</Label>
                <Input
                  placeholder={form.type === "FIXED" ? "e.g., 10" : "e.g., 20"}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  type="number"
                  min="0"
                  disabled={saving}
                />
              </div>
            </div>

            <div>
              <Label>Scope *</Label>
              <Select
                value={form.scope}
                onValueChange={(value) => setForm({ ...form, scope: value as "PRODUCT" | "ORDER" | "GLOBAL" })}
              >
                <Select.Item value="GLOBAL">Global (All Products)</Select.Item>
                <Select.Item value="ORDER">Order Level</Select.Item>
                <Select.Item value="PRODUCT">Specific Product(s)</Select.Item>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Order Amount ($)</Label>
                <Input
                  placeholder="Leave blank for no minimum"
                  value={form.min_order_amount}
                  onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={saving}
                />
              </div>

              <div>
                <Label>Max Uses</Label>
                <Input
                  placeholder="Leave blank for unlimited"
                  value={form.max_uses}
                  onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                  type="number"
                  min="1"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  value={form.starts_at}
                  onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                  type="datetime-local"
                  disabled={saving}
                />
              </div>

              <div>
                <Label>Expiration Date</Label>
                <Input
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  type="datetime-local"
                  disabled={saving}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="secondary" disabled={saving}>
                Cancel
              </Button>
            </Modal.Close>
            <Button
              onClick={handleCreateDiscount}
              disabled={saving || !form.code || !form.value}
              variant="primary"
            >
              {saving ? "Creating..." : "Create Discount"}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Container>
  );
}

// Route configuration for Medusa Admin
export const config = defineRouteConfig({
  label: "Discounts",
  icon: "tag",
  description: "Manage discount codes and promotions",
});

export default DiscountsPage;
