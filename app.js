const { createApp } = Vue;

createApp({
  data() {
    return {
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
          name: "New World Saeculum",
          period: "1594-1704",
          events: []
        }
      ],
      turningTypes: [
        {
          name: "Fourth Turning (Crisis)",
          color: "#FFE0E0",
          lightColor: "rgba(255, 224, 224, 0.1)",
          description: "A decisive era of upheaval when institutional life is destroyed and rebuilt in response to a perceived threat to the nation's survival."
        },
        {
          name: "Third Turning (Unraveling)",
          color: "#E1F5FE",
          lightColor: "rgba(225, 245, 254, 0.1)",
          description: "A downcast era of strengthening individualism and weakening institutions, when the old civic order decays and the new values regime implants."
        },
        {
          name: "Second Turning (Awakening)",
          color: "#E8F5E9",
          lightColor: "rgba(232, 245, 233, 0.1)",
          description: "A passionate era of spiritual upheaval, when the civic order comes under attack from a new values regime."
        },
        {
          name: "First Turning (High)",
          color: "#FFF3E0",
          lightColor: "rgba(255, 243, 224, 0.1)",
          description: "An upbeat era of strengthening institutions and weakening individualism, when a new civic order implants and the old values regime decays."
        }
      ]
    }
  },
  computed: {
    sortedSaecula() {
      return [...this.saecula].sort((a, b) => {
        const yearA = parseInt(a.period.split('-')[0]);
        const yearB = parseInt(b.period.split('-')[0]);
        return yearB - yearA;
      });
    }
  },
  methods: {
    sortedEvents(events) {
      return [...events].sort((a, b) => b.year - a.year);
    },
    getCategoryClass(category) {
      return category.toLowerCase().split(' ')[0].replace('(', '').replace(')', '') + '-turning';
    },
    async loadTimelineData() {
      try {
        const files = [
          'millennial-saeculum.json', 
          'great-power-saeculum.json', 
          'civil-war-saeculum.json',
          'new-world-saeculum.json'
        ];
        const responses = await Promise.all(files.map(file => fetch(file)));
        const data = await Promise.all(responses.map(response => response.json()));
        
        // Update the saecula data
        data.forEach(saeculum => {
          const existing = this.saecula.find(s => s.name === saeculum.name);
          if (existing) {
            existing.events = saeculum.events;
          }
        });
      } catch (error) {
        console.error('Error loading timeline data:', error);
      }
    }
  },
  mounted() {
    this.loadTimelineData();
  }
}).mount('#app');