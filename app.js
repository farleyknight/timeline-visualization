const { createApp } = Vue;

createApp({
  data() {
    return {
      selectedView: 'introduction', 
      selectedSaeculum: 'Millennial Saeculum',
      introductionContent: null,
      books: [],
      saecula: [
        {
          name: "Millennial Saeculum",
          period: "1946-Present",
          events: []
        },
        {
          name: "Great Power Saeculum",
          period: "1865-1946",
          events: []
        },
        {
          name: "Civil War Saeculum",
          period: "1794-1865",
          events: []
        },
        {
          name: "Revolutionary Saeculum",
          period: "1704-1794",
          events: []
        },        
        {
          name: "New World Saeculum",
          period: "1594-1704",
          events: []
        }
      ],
      turningTypes: []
    }
  },
  computed: {
    sortedSaecula() {
      return [...this.saecula].sort((a, b) => {
        const yearA = parseInt(a.period.split('-')[0]);
        const yearB = parseInt(b.period.split('-')[0]);
        return yearB - yearA;
      });
    },
    filteredSaecula() {
      return this.sortedSaecula.filter(saeculum => 
        saeculum.name === this.selectedSaeculum
      );
    }
  },
  methods: {
    sortedEvents(events) {
      return [...events].sort((a, b) => b.year - a.year);
    },
    getCategoryClass(category) {
      return category.toLowerCase().split(' ')[0].replace('(', '').replace(')', '') + '-turning';
    },
    async loadAllData() {
      try {
        // Load configuration files
        const [introResponse, turningsResponse, booksResponse] = await Promise.all([
          fetch('data/introduction.json'),
          fetch('data/turnings.json'),
          fetch('data/books.json')
        ]);
        
        const introData = await introResponse.json();
        const turningsData = await turningsResponse.json();
        const booksData = await booksResponse.json();
        
        this.introductionContent = introData;
        this.turningTypes = turningsData.turningTypes;
        this.books = booksData.books;
    
        // Load timeline data
        const timelineFiles = [
          'data/saecula/millennial-saeculum.json', 
          'data/saecula/great-power-saeculum.json', 
          'data/saecula/civil-war-saeculum.json',
          'data/saecula/revolutionary-saeculum.json',          
          'data/saecula/new-world-saeculum.json'
        ];
        
        const timelineResponses = await Promise.all(
          timelineFiles.map(file => fetch(file))
        );
        const timelineData = await Promise.all(
          timelineResponses.map(response => response.json())
        );
        
        // Update the saecula data
        timelineData.forEach(saeculum => {
          const existing = this.saecula.find(s => s.name === saeculum.name);
          if (existing) {
            existing.events = saeculum.events;
          }
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  },
  mounted() {
    this.loadAllData();
  }
}).mount('#app');