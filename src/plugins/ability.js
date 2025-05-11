import { AbilityBuilder } from "@casl/ability";

export default AbilityBuilder.define((can) => {
  if (localStorage.getItem("remotly_admin_roles")) {
    const permissions = JSON.parse(
      localStorage.getItem("remotly_admin_roles")
    ).permissions;

    permissions.forEach((permission) => {
      if (permission.action !== null && permission.subject !== null) {
        can(permission.action, permission.subject);
      }
    });
  }
});
