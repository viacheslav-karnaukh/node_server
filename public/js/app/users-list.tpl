<button type="button" class="btn btn-primary user-form">Create entry</button><br/><br/>
<% if(collection.length){ %>
<table class="table table-bordered table-hover">
    <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Company</th>
        <th>Job Position</th>
        <th>Email</th>
        <th>Phone Number</th>
        <th></th>
    </tr>
    <% _.each(collection, function(user){ %>
    <tr>
        <td><%= user.firstName %></td>
        <td><%= user.lastName %></td>
        <td><%= user.company %></td>
        <td><%= user.position %></td>
        <td><%= user.email %></td>
        <td><%= user.phoneNumber %></td>
        <td>
            <button type="button" data-id="<%= user.id %>" class="btn btn-primary btn-xs user-form">Edit</button>
            <button type="button" data-id="<%= user.id %>" class="btn btn-danger btn-xs delete-user">Delete</button>
        </td>
    </tr>
    <% }) %>
</table>
<% } else{ %>
<p class="bg-warning" style="padding: 15px;">There is no any user in DataBase.</p>
<% } %>

<div class="users-form"></div>