(function () {
  const BOOKING_KEY = 'railgo-bookings-v1';

  const TRAINS = [
    { id: 'RG101', from: 'KL Sentral', to: 'Ipoh', depart: '07:30', arrive: '09:52', duration: '2h 22m', baseFare: 34 },
    { id: 'RG209', from: 'KL Sentral', to: 'Penang', depart: '08:40', arrive: '12:58', duration: '4h 18m', baseFare: 56 },
    { id: 'RG310', from: 'KL Sentral', to: 'Johor Bahru', depart: '09:15', arrive: '13:40', duration: '4h 25m', baseFare: 62 },
    { id: 'RG404', from: 'Ipoh', to: 'KL Sentral', depart: '10:25', arrive: '12:44', duration: '2h 19m', baseFare: 32 },
    { id: 'RG530', from: 'Butterworth', to: 'KL Sentral', depart: '14:30', arrive: '18:46', duration: '4h 16m', baseFare: 58 },
    { id: 'RG612', from: 'Seremban', to: 'KL Sentral', depart: '18:00', arrive: '19:04', duration: '1h 04m', baseFare: 18 }
  ];

  const CLASS_MULTIPLIER = { Economy: 1, Business: 1.45, Sleeper: 1.8 };

  function page() {
    return document.body.dataset.page;
  }

  function readBookings() {
    try {
      return JSON.parse(localStorage.getItem(BOOKING_KEY) || '[]');
    } catch (_error) {
      return [];
    }
  }

  function writeBookings(bookings) {
    localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
  }

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  function generatePnr() {
    return `RG${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }

  function fareFor(train, travelClass, passengers) {
    const multiplier = CLASS_MULTIPLIER[travelClass] || 1;
    return Number((train.baseFare * multiplier * passengers).toFixed(2));
  }

  function initSearchPage() {
    const searchForm = document.getElementById('searchForm');
    const results = document.getElementById('results');
    const summary = document.getElementById('searchSummary');
    const bookingSection = document.getElementById('booking-section');
    const selectedTrainSummary = document.getElementById('selectedTrainSummary');
    const bookingForm = document.getElementById('bookingForm');
    const confirmation = document.getElementById('confirmation');

    let lastSearch = null;
    let selectedTrain = null;

    function renderResults(matches) {
      if (!matches.length) {
        results.className = 'train-list empty';
        results.textContent = 'No trains match this route/date. Try another station pair.';
        return;
      }

      results.className = 'train-list';
      results.innerHTML = matches.map((train) => {
        const fare = fareFor(train, lastSearch.travelClass, lastSearch.passengers);
        return `
          <article class="train-card">
            <div class="train-head">
              <strong>${train.id}: ${train.from} → ${train.to}</strong>
              <span class="price">RM ${fare.toFixed(2)}</span>
            </div>
            <div class="train-meta">${train.depart} - ${train.arrive} (${train.duration}) • ${lastSearch.travelClass} • ${lastSearch.passengers} passenger(s)</div>
            <div class="actions">
              <button class="btn primary" type="button" data-train-id="${train.id}">Select Train</button>
            </div>
          </article>
        `;
      }).join('');

      results.querySelectorAll('[data-train-id]').forEach((button) => {
        button.addEventListener('click', () => {
          selectedTrain = matches.find((train) => train.id === button.dataset.trainId);
          bookingSection.classList.remove('hidden');
          selectedTrainSummary.textContent = `${selectedTrain.id}: ${selectedTrain.from} → ${selectedTrain.to} on ${lastSearch.travelDate}, ${selectedTrain.depart}. Total fare: RM ${fareFor(selectedTrain, lastSearch.travelClass, lastSearch.passengers).toFixed(2)}`;
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      confirmation.classList.add('hidden');

      lastSearch = {
        from: document.getElementById('from').value,
        to: document.getElementById('to').value,
        travelDate: document.getElementById('travelDate').value,
        passengers: Number(document.getElementById('passengers').value),
        travelClass: document.getElementById('travelClass').value
      };

      const from = normalize(lastSearch.from);
      const to = normalize(lastSearch.to);

      const matches = TRAINS.filter((train) => normalize(train.from) === from && normalize(train.to) === to);

      summary.textContent = `${lastSearch.from} → ${lastSearch.to} • ${lastSearch.travelDate}`;
      renderResults(matches);
    });

    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!selectedTrain || !lastSearch) {
        alert('Please search and select a train first.');
        return;
      }

      const booking = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        pnr: generatePnr(),
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        train: selectedTrain,
        trip: {
          from: lastSearch.from,
          to: lastSearch.to,
          travelDate: lastSearch.travelDate,
          travelClass: lastSearch.travelClass,
          passengers: lastSearch.passengers,
          fare: fareFor(selectedTrain, lastSearch.travelClass, lastSearch.passengers)
        },
        passenger: {
          fullName: document.getElementById('fullName').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          idNumber: document.getElementById('idNumber').value
        },
        payment: {
          cardName: document.getElementById('cardName').value,
          cardLast4: document.getElementById('cardNumber').value.replace(/\s+/g, '').slice(-4)
        }
      };

      const bookings = readBookings();
      bookings.unshift(booking);
      writeBookings(bookings);

      confirmation.classList.remove('hidden');
      confirmation.innerHTML = `
        <div class="confirmation">
          <h3>✅ Booking Confirmed</h3>
          <div class="confirm-grid">
            <p><strong>PNR:</strong> ${booking.pnr}</p>
            <p><strong>Status:</strong> <span class="status CONFIRMED">${booking.status}</span></p>
            <p><strong>Passenger:</strong> ${booking.passenger.fullName}</p>
            <p><strong>Route:</strong> ${booking.trip.from} → ${booking.trip.to}</p>
            <p><strong>Departure:</strong> ${booking.trip.travelDate} at ${booking.train.depart}</p>
            <p><strong>Total Paid:</strong> RM ${booking.trip.fare.toFixed(2)}</p>
            <p><strong>Train:</strong> ${booking.train.id}</p>
            <p><strong>Payment:</strong> **** **** **** ${booking.payment.cardLast4}</p>
          </div>
          <div class="actions">
            <a class="btn primary" href="reservation.html">View My Bookings</a>
          </div>
        </div>
      `;

      bookingForm.reset();
      bookingSection.classList.add('hidden');
      confirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function initBookingsPage() {
    const list = document.getElementById('bookingList');
    const form = document.getElementById('bookingFilterForm');
    const queryInput = document.getElementById('bookingQuery');
    const statusInput = document.getElementById('bookingStatus');

    function render(query = '', status = 'all') {
      const q = normalize(query);
      const bookings = readBookings().filter((booking) => {
        const matchQuery = !q || booking.pnr.toLowerCase().includes(q) || booking.passenger.fullName.toLowerCase().includes(q);
        const matchStatus = status === 'all' || booking.status === status;
        return matchQuery && matchStatus;
      });

      if (!bookings.length) {
        list.className = 'train-list empty';
        list.textContent = 'No bookings found for this filter.';
        return;
      }

      list.className = 'train-list';
      list.innerHTML = bookings.map((booking) => `
        <article class="train-card">
          <div class="train-head">
            <strong>${booking.pnr} • ${booking.train.id}</strong>
            <span class="status ${booking.status}">${booking.status}</span>
          </div>
          <div class="train-meta">${booking.trip.from} → ${booking.trip.to} on ${booking.trip.travelDate}, ${booking.train.depart} • ${booking.trip.travelClass} • ${booking.trip.passengers} passenger(s)</div>
          <div class="train-meta">Passenger: ${booking.passenger.fullName} • Paid: RM ${booking.trip.fare.toFixed(2)}</div>
          <div class="actions">
            ${booking.status === 'CONFIRMED' ? `<button type="button" class="btn" data-cancel-id="${booking.id}">Cancel Booking</button>` : ''}
          </div>
        </article>
      `).join('');

      list.querySelectorAll('[data-cancel-id]').forEach((button) => {
        button.addEventListener('click', () => {
          const next = readBookings().map((booking) => booking.id === button.dataset.cancelId
            ? { ...booking, status: 'CANCELLED' }
            : booking);
          writeBookings(next);
          render(queryInput.value, statusInput.value);
        });
      });
    }

    render();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      render(queryInput.value, statusInput.value);
    });
  }

  if (page() === 'search') {
    initSearchPage();
  } else if (page() === 'bookings') {
    initBookingsPage();
  }
})();
