/*
Finite state machine and
bit-flags to establish
permissions in interactions between
different user types
 */
const USER_TYPE_BIT = {
  'APPLICANT' : 0b0001,
  'EMPLOYER' : 0b0010,
  'ADMIN' : 0b0011
}

function UserRelationPermsFSM(user1,user2){
  const logged_in_usermail = window.localStorage.getItem("email")
  if (user2.email == logged_in_usermail)
    [user1,user2] = [user2,user1];
  else if (user1.email != logged_in_usermail)
    throw new Error("One of the two users interacted should be the one logged in the current session!");

  let isSelf = parseInt(user1.email == user2.email)
  let ub1 = USER_TYPE_BIT[user1.userType]
  let ub2 = (USER_TYPE_BIT[user2.userType] << 2)

  /*
  ANTOINE C.:    I MADE A FINITE STATE MACHINE AND
  A BIT MATH ALGORITHM TO PROCESS THESE....
  DO NOT TOUCH
   */



}

export const menuItems = [
  {
    title: 'Home',
    url: '/',
  },
  {
    title: 'Services',
    url: '/services',
  },
  {
    title: 'About',
    url: '/about',
  },
];