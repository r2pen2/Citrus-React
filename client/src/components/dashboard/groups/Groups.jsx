import "./groups.scss"

export default function Groups({user}) {
  return (
    <div>
        <h1>Groups page for user {user.uid}</h1>
        <h2>Needs implementation</h2>
        <a href="https://github.com/r2pen2/Citrus-React/issues/90">Github: Implement Dashboard/Groups #90</a>
        <ul>
            <li><a href="/groups/join">Join Group</a></li>
            <li><a href="/groups/new">New Group</a></li>
        </ul>
    </div>
  )
}
