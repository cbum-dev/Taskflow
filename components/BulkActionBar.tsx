import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function BulkActionsBar({
  selectedIds,
  clearSelection,
  onUpdate,
  onDelete,
  access_token,
  socket,
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async () => {
    if (!window.confirm(`Change status for ${selectedIds.length} issues?`)) return;
    setIsUpdating(true);
    try {
      // Assume your backend supports bulk status update endpoint
      const { data } = await axios.put(
        `http://localhost:3001/api/issues/bulk-update-status`,
        { ids: selectedIds, status: "DONE" },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      onUpdate(data);
      socket.emit("issuesBulkUpdated", data);
      clearSelection();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} issues?`)) return;
    setIsUpdating(true);
    try {
      // Assume your backend supports bulk delete endpoint
      await axios.delete(`http://localhost:3001/api/issues/bulk-delete`, {
        headers: { Authorization: `Bearer ${access_token}` },
        data: { ids: selectedIds },
      });
      onDelete(selectedIds);
      socket.emit("issuesBulkDeleted", selectedIds);
      clearSelection();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded mt-4 border border-gray-300 dark:border-gray-700">
      <span>{selectedIds.length} selected</span>
      <div className="flex gap-2">
        <Button onClick={handleStatusChange} disabled={isUpdating}>
          Mark Done
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isUpdating}>
          Delete
        </Button>
        <Button variant="ghost" onClick={clearSelection} disabled={isUpdating}>
          Clear
        </Button>
      </div>
    </div>
  );
}
