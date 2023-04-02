/*
Finite state machine and
bit-flags to establish
permissions in interactions between
different user types
 */
import {Link} from "react-router-dom";
// import jwtDecode from "jwt-decode";
// import Cookies from "js-cookie";

const USER_TYPE_BIT = {
  'APPLICANT' : 0b0001,
  'EMPLOYER' : 0b0010,
  'ADMIN' : 0b0011
}


export default function UserRelationPermsFSM(user1,user2){
    /*
  @author ANTOINE C.:
  FINITE STATE MACHINE AND
  A BIT MATH ALGORITHM TO PROCESS PERMISSIONS BETWEEN USERS
  Do not alter before requesting review
   */

  // const logged_in_usermail = jwtDecode(Cookies.get("access_token")).email
  // if (user2.email === logged_in_usermail)
  //   [user1,user2] = [user2,user1];

  // else if (user1.email !== logged_in_usermail)
  //   throw new Error("One of the two users interacted should be the one logged in the current session!");

  let isSelf = +(user1.email === user2.email) << 4
  let ub1 = USER_TYPE_BIT[user1.userType]
  let ub2 = USER_TYPE_BIT[user2.userType] << 2

  switch (isSelf | ub2 | ub1) {

    case 0b00101: //Applicant views other Applicant
      return <div></div>
    case 0b10101: //Applicant views itself
      return <div>
        <li> <Link to="/current/applications"> My Applications </Link> </li>
        <li> <Link to="/current/interviews"> My Interviews </Link> </li>
    </div>
    case 0b01001: //Applicant views Employer
        //TODO : Might want to encrypt uid here if could be dangerous to leak it / or risk it being hacked
      return <div>
        <li> <Link to={"/" + user2.uid +  "/jobpostings"}>
          {user2.firstName} {user2.lastName}'s Job Postings </Link> </li>
      </div>
    case 0b01101: //Applicant views Admin
      return <div></div>
    case 0b00110: //Employer views Applicant
      return <div>
      <li>
        <Link to={"/" + user2.uid + "/makeOffer"}> Make {user2.firstName} {user2.lastName} an offer</Link>
      </li>
      </div>
    case 0b01010: //Employer views other Employer
      return <div>
      <li> <Link to={"/" + user2.uid +  "/jobpostings"}>
          {user2.firstName} {user2.lastName}'s Job Postings </Link> </li>
      </div>
    case 0b11010: //Employer views itself
      return <div>
        <li> <Link to="/current/jobpostings"> My Job Postings </Link></li>
        <li> <Link to="/current/interviews"> My Interviews </Link></li>
      </div>
    case 0b01110: //Employer views Admin
      return <div></div>
    case 0b00111: //Admin views Applicant
      return <div>
        <li> <Link to={"/" + user2.uid +  "/applications"}> {user2.email}'s Applications </Link> </li>
        <li> <Link to={"/" + user2.uid +  "/interviews"}> {user2.email}'s Interviews </Link> </li>
      </div>
    case 0b01011: //Admin views Employer
      return <div>
        <li> <Link to={"/" + user2.uid +  "/jobpostings"}> {user2.email}'s Job Postings </Link> </li>
        <li> <Link to={"/" + user2.uid +  "/interviews"}> {user2.email}'s Interviews </Link> </li>
      </div>
    case 0b01111: //Admin views other Admin
      return <div></div>
    case 0b11111: //Admin views itself
      return <div>
      <li> <Link to={"/admin_commandpanel"}> Admin Command Panel </Link></li>
      </div>
    default:
      return <div>
        <li> <b>Invalid/Unaccessible User ! </b>  </li>
      </div>

  }




}