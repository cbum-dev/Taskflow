export function filterAndSortIssues(
  issues,
  search,
  statusFilter,
  assigneeFilter,
  sortBy,
  sortOrder
) {
  let data = issues;

  if (search?.trim()) {
    data = data.filter((i) =>
      i.title.toLowerCase().includes(search.trim().toLowerCase())
    );
  }
  if (statusFilter) {
    data = data.filter((i) => i.status === statusFilter);
  }
  if (assigneeFilter) {
    data = data.filter((i) => i.assignee?.id === assigneeFilter);
  }

  if (sortBy) {
    data = [...data].sort((a, b) => {
      let v1, v2;
      switch (sortBy) {
        case "title":
          v1 = a.title.toLowerCase();
          v2 = b.title.toLowerCase();
          return sortOrder === "asc" ? v1.localeCompare(v2) : v2.localeCompare(v1);
        case "status":
          v1 = a.status;
          v2 = b.status;
          return sortOrder === "asc" ? v1.localeCompare(v2) : v2.localeCompare(v1);
        case "priority":
          const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
          v1 = priorities.indexOf(a.priority);
          v2 = priorities.indexOf(b.priority);
          return sortOrder === "asc" ? v1 - v2 : v2 - v1;
        case "assignee":
          v1 = a.assignee?.name?.toLowerCase() || "";
          v2 = b.assignee?.name?.toLowerCase() || "";
          return sortOrder === "asc" ? v1.localeCompare(v2) : v2.localeCompare(v1);
        case "dueDate":
          v1 = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          v2 = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return sortOrder === "asc" ? v1 - v2 : v2 - v1;
        default:
          return 0;
      }
    });
  }

  return data;
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === "DONE") return false;
  return new Date(dueDate) < new Date();
}
