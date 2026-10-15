
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [phoneFilter, setPhoneFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editFormData, setEditFormData] = useState({
  name: "",
  email: "",
  phone: "",
});

  async function fetchCustomers() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setCustomers(data);
    setLoading(false);
  }

  useEffect(() => {
    async function fetchUserEmail() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      setEmail(data.user?.email ?? "");
    }

    fetchUserEmail();
    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


const handleUpdateCustomer = async (customerId) => {
  const { error } = await supabase
    .from("customers")
    .update({
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone || null,
    })
    .eq("id", customerId);

  if (error) {
    setError(error.message);
    return;
  }

  setEditingCustomerId(null);
  await fetchCustomers();
};


const handleDeleteCustomer = async (customerId) => {
    const confirmed = window.confirm(
  "Are you sure you want to delete this customer?"
);

if (!confirmed) return;
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId);

  if (error) {
    setError(error.message);
    return;
  }

  await fetchCustomers();
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
  setError(userError?.message || "You must be logged in to add a customer.");
  return;
}
const { error: insertError } = await supabase
  .from("customers")
  .insert({
    user_id: user.id,
    name: formData.name,
    email: formData.email,
    phone: formData.phone || null,
  });
  if (insertError) {
  setError(insertError.message);
  return;
}
setFormData({
  name: "",
  email: "",
  phone: "",
});

await fetchCustomers();
};

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      navigate("/login");
    }
  };


  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const customersWithPhone = filteredCustomers.filter((customer) => customer.phone);

  const displayedCustomers = phoneFilter === "withPhone" ? customersWithPhone : filteredCustomers;

const sortedCustomers = [...displayedCustomers];

if (sortOrder === "az") {
  sortedCustomers.sort((a, b) => a.name.localeCompare(b.name));
}

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Email: {email}</p>

      {loading && <p>Loading customers...</p>}
      {error && <p>Error: {error}</p>}

      <h2>Add Customer</h2>

     <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>

        <br />

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>

        <br />

        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </label>

        <br />

        <button type="submit">Add Customer</button>
        
      </form>

      <h2>Customers</h2>
    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value='newest'>Newest first</option>
        <option value='az'>A-Z</option>
        <option value='za'>Z-A</option>
    </select>
    <select value={phoneFilter} onChange={(e) => setPhoneFilter(e.target.value)}>
  <option value="all">All customers</option>
  <option value="withPhone">With phone numbers</option>
</select>
    <input type="text"
  placeholder="Search customers..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

      {!loading && filteredCustomers.length === 0 && !error && (
        <p>No customers match your search.</p>
      )}



      {sortedCustomers.map((customer) => (
        <div key={customer.id}>
          <p>Name: {customer.name}</p>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone || "Not provided"}</p>
        <button
  onClick={() => {
    setEditingCustomerId(customer.id);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
    });
  }}
>
  Edit
</button>

    {editingCustomerId === customer.id && (
    <>
    <input
  name="name"
  value={editFormData.name}
  onChange={(e) =>
    setEditFormData({ ...editFormData, name: e.target.value })
  }
/>
<input
  name="email"
  value={editFormData.email}
  onChange={(e) =>
    setEditFormData({ ...editFormData, email: e.target.value })
  }
/>
<input
  name="phone"
  value={editFormData.phone}
  onChange={(e) =>
    setEditFormData({ ...editFormData, phone: e.target.value })
  }
/>
<button
  type="button"
  onClick={() => handleUpdateCustomer(customer.id)}
>
  Save Changes
</button>

<button
  type="button"
  onClick={() => handleDeleteCustomer(customer.id)}
>
  Delete
</button>
</>

    )}


        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
