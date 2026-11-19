
import React, { useEffect, useMemo, useState } from "react";
import {
  Compass, LayoutDashboard, Map, MapPin, CalendarDays,
  Plus, Search, Menu, X, ArrowUpRight, Clock,
  Plane, Mountain, Waves, Camera, Utensils, Trash2,
  RefreshCw, Sparkles, ChevronRight,
  CircleCheck, AlertCircle
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "/api";

const destinationImages = [
  "photo-1512343879784-a960bf40e7f2",
  "photo-1533105079780-92b9be482077",
  "photo-1500530855697-b586d89ba3ee",
  "photo-1464822759023-fed622ff2c3b",
  "photo-1516483638261-f4dbaf036963",
  "photo-1476514525535-07fb3b4ae5f1"
];

const sampleDestinations = [
  { id: "d1", name: "Bali", country: "Indonesia", description: "Tropical escapes" },
  { id: "d2", name: "Santorini", country: "Greece", description: "Island adventures" },
  { id: "d3", name: "Swiss Alps", country: "Switzerland", description: "Mountain retreats" },
  { id: "d4", name: "Goa", country: "India", description: "Beaches and sunsets" }
];

function imageUrl(index) {
  return `https://images.unsplash.com/${destinationImages[index % destinationImages.length]}?auto=format&fit=crop&w=900&q=85`;
}

function formatDate(date) {
  if (!date) return "Date not set";
  const parsed = new Date(date + (date.length === 10 ? "T12:00:00" : ""));
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
}

function getErrorMessage(error) {
  return error?.message || "Something went wrong. Please try again.";
}

function App() {
  const [page, setPage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentTime] = useState(() => Date.now());
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showTripForm, setShowTripForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [tripForm, setTripForm] = useState({
    title: "", description: "", startingLocation: "",
    startDate: "", endDate: "", userId: ""
  });

  const [activityForm, setActivityForm] = useState({
    name: "", description: "", scheduledAt: "", tripId: ""
  });

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed (${response.status})`);
    }

    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async function loadData() {
    setLoading(true);
    setError("");
    setNotice("");

    const results = await Promise.allSettled([
      request("/trips"),
      request("/destinations"),
      request("/activities"),
      request("/users")
    ]);

    const [tripResult, destinationResult, activityResult, userResult] = results;

    const backendUnavailable = results.every((result) => result.status === "rejected");

    if (tripResult.status === "fulfilled") {
      setTrips(Array.isArray(tripResult.value) ? tripResult.value : []);
    } else if (backendUnavailable) {
      setTrips([]);
    }
    if (destinationResult.status === "fulfilled") {
      setDestinations(Array.isArray(destinationResult.value) ? destinationResult.value : []);
    } else if (backendUnavailable) {
      setDestinations(sampleDestinations);
    }
    if (activityResult.status === "fulfilled") {
      setActivities(Array.isArray(activityResult.value) ? activityResult.value : []);
    } else if (backendUnavailable) {
      setActivities([]);
    }
    if (userResult.status === "fulfilled") {
      setUsers(Array.isArray(userResult.value) ? userResult.value : []);
    } else if (backendUnavailable) {
      setUsers([]);
    }

    if (backendUnavailable) {
      setNotice("Demo data is being shown because the backend is unavailable.");
    } else if (results.some((result) => result.status === "rejected")) {
      setError("Some data could not be loaded. Check your backend endpoints.");
    }

    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredTrips = useMemo(() => {
    const term = search.trim().toLowerCase();
    return trips.filter((trip) =>
      [trip.title, trip.description, trip.startingLocation]
        .some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [trips, search]);

  const filteredDestinations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return destinations.filter((destination) =>
      [destination.name, destination.country, destination.description]
        .some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [destinations, search]);

  const upcomingTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (!trip.startDate) return false;
      return Date.parse(`${trip.startDate}T23:59:59`) >= currentTime;
    });
  }, [trips, currentTime]);

  const navItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "My Trips", icon: Map },
    { name: "Destinations", icon: Compass },
    { name: "Activities", icon: CalendarDays }
  ];

  function navigate(name) {
    setPage(name);
    setSearch("");
    setSidebarOpen(false);
  }

  async function createTrip(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        ...tripForm,
        userId: tripForm.userId ? Number(tripForm.userId) : null
      };
      await request("/trips", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setShowTripForm(false);
      setTripForm({
        title: "", description: "", startingLocation: "",
        startDate: "", endDate: "", userId: ""
      });
      setNotice("Your trip has been created!");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteTrip(id) {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    setError("");
    try {
      await request(`/trips/${id}`, { method: "DELETE" });
      setTrips((current) => current.filter((trip) => trip.id !== id));
      setActivities((current) =>
        current.filter((activity) => activity.tripId !== id)
      );
      setNotice("Trip deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function createActivity(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      await request("/activities", {
        method: "POST",
        body: JSON.stringify({
          ...activityForm,
          tripId: Number(activityForm.tripId),
          scheduledAt: activityForm.scheduledAt
            ? new Date(activityForm.scheduledAt).toISOString().slice(0, 19)
            : null
        })
      });
      setShowActivityForm(false);
      setActivityForm({
        name: "", description: "", scheduledAt: "", tripId: ""
      });
      setNotice("Activity added to your itinerary!");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const activityIcons = [Mountain, Waves, Camera, Utensils];

  function renderTripCard(trip, index) {
    const tripActivities = activities.filter(
      (activity) => Number(activity.tripId) === Number(trip.id)
    );

    return (
      <article className="trip-card" key={trip.id}>
        <div className="trip-image-wrap">
          <img
            src={imageUrl(index)}
            alt={trip.title || "Travel destination"}
            className="trip-image"
          />
          <span className="trip-badge">
            {trip.startDate ? "YOUR JOURNEY" : "PLANNING"}
          </span>
          <button
            className="icon-button trip-delete"
            onClick={() => deleteTrip(trip.id)}
            aria-label={`Delete ${trip.title}`}
            title="Delete trip"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="trip-card-body">
          <div className="trip-location">
            <MapPin size={14} />
            {trip.startingLocation || "Explore somewhere new"}
          </div>
          <h3>{trip.title || "Untitled trip"}</h3>
          <p className="trip-description">
            {trip.description || "Your next adventure is waiting."}
          </p>
          <div className="trip-meta">
            <span><CalendarDays size={15} /> {formatDate(trip.startDate)}</span>
            <span><Clock size={15} /> {tripActivities.length} activities</span>
          </div>
          <button
            className="text-button"
            onClick={() => {
              setActivityForm({
                name: "", description: "", scheduledAt: "", tripId: String(trip.id)
              });
              setShowActivityForm(true);
            }}
          >
            Plan an activity <ArrowUpRight size={16} />
          </button>
        </div>
      </article>
    );
  }

  function renderDestinations(items) {
    return (
      <div className="destination-grid">
        {items.map((destination, index) => (
          <article className="destination-card" key={destination.id ?? index}>
            <img
              src={imageUrl(index)}
              alt={destination.name}
              loading="lazy"
            />
            <div className="destination-overlay">
              <span><MapPin size={14} /> {destination.country || "Discover"}</span>
              <h3>{destination.name}</h3>
              <p>{destination.description || "Find your next unforgettable experience."}</p>
              <button
                className="destination-action"
                onClick={() => {
                  setTripForm((current) => ({
                    ...current,
                    title: `Trip to ${destination.name}`,
                    startingLocation: current.startingLocation || "Hyderabad"
                  }));
                  setShowTripForm(true);
                }}
              >
                Plan a trip <ArrowUpRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    );
  }

  function renderActivities() {
    if (!activities.length) {
      return (
        <EmptyState
          icon={CalendarDays}
          title="Your itinerary starts here"
          description="Create a trip and add activities to organize your travel plans."
          action={() => setShowActivityForm(true)}
          actionLabel="Add an activity"
        />
      );
    }

    return (
      <div className="activity-list">
        {activities.map((activity, index) => {
          const Icon = activityIcons[index % activityIcons.length];
          const trip = trips.find(
            (item) => Number(item.id) === Number(activity.tripId)
          );
          return (
            <article className="activity-row" key={activity.id}>
              <div className="activity-icon"><Icon size={21} /></div>
              <div className="activity-details">
                <h3>{activity.name}</h3>
                <p>{activity.description || "An experience to remember"}</p>
                <span>{trip?.title || `Trip #${activity.tripId}`}</span>
              </div>
              <div className="activity-date">
                <CalendarDays size={15} />
                {activity.scheduledAt
                  ? new Date(activity.scheduledAt).toLocaleString([], {
                      dateStyle: "medium", timeStyle: "short"
                    })
                  : "Date not set"}
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Compass size={25} /></div>
          <div>
            <h2>Trip<span>ly</span></h2>
            <p>YOUR TRAVEL COMPANION</p>
          </div>
          <button className="icon-button close-menu" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="nav-menu">
          {navItems.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${page === name ? "active" : ""}`}
              onClick={() => navigate(name)}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "My Trips" && <span className="nav-count">{trips.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="travel-tip">
          <div className="tip-icon"><Sparkles size={19} /></div>
          <h3>Life is short.</h3>
          <h3>Travel more.</h3>
          <p>Collect moments, not things. Your next story is waiting.</p>
          <button onClick={() => navigate("Destinations")}>
            Explore places <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="avatar">M</div>
          <div className="profile-text">
            <strong>Travel Explorer</strong>
            <span>Personal workspace</span>
          </div>
          <Sparkles size={17} className="profile-star" />
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="breadcrumb">Workspace <ChevronRight size={15} /> <strong>{page}</strong></div>
          <div className="topbar-actions">
            <label className="global-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search trips or places..."
              />
              {search && (
                <button className="clear-search" onClick={() => setSearch("")}>
                  <X size={15} />
                </button>
              )}
            </label>
            <button
              className="icon-button notification-button"
              aria-label="Refresh data"
              title="Refresh dashboard"
              onClick={loadData}
            >
              <RefreshCw size={19} />
            </button>
            <div className="top-avatar">M</div>
          </div>
        </header>

        <div className="page-content">
          {error && (
            <div className="notice error-notice">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button onClick={() => setError("")}><X size={16} /></button>
            </div>
          )}
          {notice && (
            <div className="notice success-notice">
              <CircleCheck size={18} />
              <span>{notice}</span>
              <button onClick={() => setNotice("")}><X size={16} /></button>
            </div>
          )}

          {page === "Overview" && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow"><Sparkles size={15} /> YOUR NEXT CHAPTER</div>
                  <h1>Adventure <span>awaits.</span></h1>
                  <p>Every journey tells a story. Where will yours take you?</p>
                </div>
                <button className="primary-button" onClick={() => setShowTripForm(true)}>
                  <Plus size={18} /> Create a trip
                </button>
              </section>

              <section className="hero-banner">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1800&q=90"
                  alt="Beautiful turquoise lake surrounded by mountains"
                />
                <div className="hero-shade" />
                <div className="hero-content">
                  <span className="hero-pill"><Sparkles size={13} /> FIND YOUR ESCAPE</span>
                  <h2>The world is<br />closer than you think.</h2>
                  <p>New places. New stories. Unforgettable memories.</p>
                  <button onClick={() => navigate("Destinations")}>
                    Discover destinations <ArrowUpRight size={17} />
                  </button>
                </div>
                <div className="hero-caption">
                  <MapPin size={15} /> Somewhere beautiful
                </div>
              </section>

              <section className="stats-grid">
                <StatCard icon={Map} label="Total trips" value={trips.length} detail="Your travel collection" />
                <StatCard icon={Plane} label="Upcoming trips" value={upcomingTrips.length} detail="Adventure on the horizon" />
                <StatCard icon={MapPin} label="Destinations" value={destinations.length} detail="Places on your map" />
                <StatCard icon={CalendarDays} label="Activities" value={activities.length} detail="Experiences planned" />
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">YOUR TRAVEL DIARY</div>
                    <h2>Upcoming adventures</h2>
                    <p>All the places you're dreaming about.</p>
                  </div>
                  <button className="view-all" onClick={() => navigate("My Trips")}>
                    View all trips <ArrowUpRight size={16} />
                  </button>
                </div>

                {loading ? (
                  <LoadingState />
                ) : trips.length ? (
                  <div className="trip-grid">
                    {trips.slice(0, 3).map(renderTripCard)}
                  </div>
                ) : (
                  <EmptyState
                    icon={Plane}
                    title="Your first adventure is waiting"
                    description="Create a trip and start building memories."
                    action={() => setShowTripForm(true)}
                    actionLabel="Create your first trip"
                  />
                )}
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">HANDPICKED FOR YOU</div>
                    <h2>Explore the world</h2>
                    <p>Find inspiration for your next great escape.</p>
                  </div>
                  <button className="view-all" onClick={() => navigate("Destinations")}>
                    All destinations <ArrowUpRight size={16} />
                  </button>
                </div>
                {renderDestinations(
                  (destinations.length ? destinations : sampleDestinations).slice(0, 3)
                )}
                {!destinations.length && (
                  <p className="demo-note">Explore these sample places. Add destinations through your backend to manage your own collection.</p>
                )}
              </section>
            </>
          )}

          {page === "My Trips" && (
            <section className="section-block page-section">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">YOUR PERSONAL COLLECTION</div>
                  <h1>My trips</h1>
                  <p>Every great adventure begins with a plan.</p>
                </div>
                <button className="primary-button" onClick={() => setShowTripForm(true)}>
                  <Plus size={18} /> New trip
                </button>
              </div>
              {loading ? <LoadingState /> : filteredTrips.length ? (
                <div className="trip-grid">
                  {filteredTrips.map(renderTripCard)}
                </div>
              ) : (
                <EmptyState
                  icon={Map}
                  title={search ? "No matching trips" : "No trips yet"}
                  description={search ? "Try another search term." : "Create your first trip and make it yours."}
                  action={() => search ? setSearch("") : setShowTripForm(true)}
                  actionLabel={search ? "Clear search" : "Create a trip"}
                />
              )}
            </section>
          )}

          {page === "Destinations" && (
            <section className="section-block page-section">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">THE WORLD IS YOURS</div>
                  <h1>Find your somewhere.</h1>
                  <p>Discover beautiful places and turn your dreams into itineraries.</p>
                </div>
              </div>
              {renderDestinations(
                filteredDestinations.length || destinations.length
                  ? filteredDestinations
                  : search ? [] : sampleDestinations
              )}
              {!destinations.length && !search && (
                <p className="demo-note">These are sample destinations. Add records to your destinations API to make them persistent.</p>
              )}
              {!filteredDestinations.length && search && (
                <EmptyState
                  icon={Search}
                  title="No destinations found"
                  description="Try searching for a different place."
                  action={() => setSearch("")}
                  actionLabel="Clear search"
                />
              )}
            </section>
          )}

          {page === "Activities" && (
            <section className="section-block page-section">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">MAKE EVERY MOMENT COUNT</div>
                  <h1>Your itinerary</h1>
                  <p>All the little experiences that make a trip unforgettable.</p>
                </div>
                <button className="primary-button" onClick={() => setShowActivityForm(true)}>
                  <Plus size={18} /> Add activity
                </button>
              </div>
              {loading ? <LoadingState /> : renderActivities()}
            </section>
          )}

          <footer className="app-footer">
            <span>Made for curious souls <span className="footer-heart">♥</span></span>
            <span>Triply · Your next adventure starts here</span>
          </footer>
        </div>
      </main>

      {showTripForm && (
        <Modal title="Plan a new adventure" subtitle="Every unforgettable journey starts somewhere." onClose={() => setShowTripForm(false)}>
          <form className="modal-form" onSubmit={createTrip}>
            <label>Trip name *
              <input required value={tripForm.title} placeholder="e.g. Weekend in Goa"
                onChange={(e) => setTripForm({ ...tripForm, title: e.target.value })} />
            </label>
            <label>Starting location *
              <input required value={tripForm.startingLocation} placeholder="e.g. Hyderabad"
                onChange={(e) => setTripForm({ ...tripForm, startingLocation: e.target.value })} />
            </label>
            <label>Description
              <textarea rows="3" value={tripForm.description} placeholder="What makes this trip special?"
                onChange={(e) => setTripForm({ ...tripForm, description: e.target.value })} />
            </label>
            <div className="form-row">
              <label>Start date *
                <input type="date" required value={tripForm.startDate}
                  onChange={(e) => setTripForm({ ...tripForm, startDate: e.target.value })} />
              </label>
              <label>End date *
                <input type="date" required min={tripForm.startDate || undefined} value={tripForm.endDate}
                  onChange={(e) => setTripForm({ ...tripForm, endDate: e.target.value })} />
              </label>
            </div>
            <label>Traveler / user *
              <select required value={tripForm.userId}
                onChange={(e) => setTripForm({ ...tripForm, userId: e.target.value })}>
                <option value="">Select a registered user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name} (ID: {user.id})</option>
                ))}
              </select>
              {!users.length && <small>Create a user through POST /api/users first.</small>}
            </label>
            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setShowTripForm(false)}>Cancel</button>
              <button className="primary-button" disabled={saving || !users.length}>
                {saving ? "Creating..." : <><Plus size={17} /> Create trip</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showActivityForm && (
        <Modal title="Add an experience" subtitle="Make room for something memorable." onClose={() => setShowActivityForm(false)}>
          <form className="modal-form" onSubmit={createActivity}>
            <label>Activity name *
              <input required value={activityForm.name} placeholder="e.g. Sunset beach walk"
                onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })} />
            </label>
            <label>Description
              <textarea rows="3" value={activityForm.description} placeholder="Add a few details..."
                onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })} />
            </label>
            <label>Related trip *
              <select required value={activityForm.tripId}
                onChange={(e) => setActivityForm({ ...activityForm, tripId: e.target.value })}>
                <option value="">Choose a trip</option>
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>{trip.title}</option>
                ))}
              </select>
            </label>
            <label>Date and time
              <input type="datetime-local" value={activityForm.scheduledAt}
                onChange={(e) => setActivityForm({ ...activityForm, scheduledAt: e.target.value })} />
            </label>
            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setShowActivityForm(false)}>Cancel</button>
              <button className="primary-button" disabled={saving || !trips.length}>
                {saving ? "Saving..." : <><Plus size={17} /> Save activity</>}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className="stat-icon"><Icon size={19} /></span>
        <ArrowUpRight size={17} className="stat-arrow" />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-detail">{detail}</div>
    </article>
  );
}

function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon size={27} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="primary-button" onClick={action}>{actionLabel}</button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="loading-state">
      <span className="loading-spinner" />
      <p>Gathering your adventures...</p>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-heading">
          <div>
            <div className="eyebrow">TRIPLY PLANNER</div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close modal"><X size={20} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

export default App;
