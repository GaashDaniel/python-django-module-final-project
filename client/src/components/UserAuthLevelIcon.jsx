import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserEdit,
  faUserShield,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";

export default function UserAuthLevelIcon({ user }) {
  let tooltipText = "Guest";
  let icon = faUser;
  let userLevel = "guest";

  if (user) {
    if (user.is_admin) {
      tooltipText = "Admin";
      icon = faUserShield;
      userLevel = "admin";
    } else if (user.is_editor) {
      tooltipText = "Editor";
      icon = faUserEdit;
      userLevel = "editor";
    } else {
      tooltipText = "User";
      icon = faUserAstronaut;
      userLevel = "user";
    }
  }

  return (
    <div className="user-auth-icon" title={tooltipText}>
      <FontAwesomeIcon icon={icon} className={`user-icon ${userLevel}`} />
    </div>
  );
}
