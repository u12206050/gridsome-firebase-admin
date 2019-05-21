<template>
    <gmap-map
      :center="center"
      :zoom="13"
      v-bind:options="mapStyle"
      style="width:100%;  height: 400px;"
      @click="clicked"
    >
      <gmap-marker
        :position="syncValue"
        :clickable="true" :draggable="true"
        @position_changed="onPosChange"
      ></gmap-marker>
    </gmap-map>
</template>

<script>
import MapStyle from '../google-map-style'

export default {
  name: "GoogleMap",
  props: {
    value: { required: true }
  },
  data() {
    return {
      center: { lat: 59.415886099, lng: 10.4823124999 },
      mapStyle: {
        styles: MapStyle
      }
    };
  },
  computed: {
    syncValue: {
      get() {
        return this.value
          ? { lat: this.value._lat * 1, lng: this.value._long * 1 }
          : this.center;
      },
      set(newValue) {
        this.$emit("input", {
          _lat: newValue.lat,
          _long: newValue.lng
        });
      }
    }
  },
  mounted() {
    this.geolocate();
  },

  methods: {
    clicked(e) {
      this.syncValue = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
    },
    onPosChange(pos) {
      if (this.syncValue.lat !== pos.lat() || this.syncValue.lng !== pos.lng()) {
        this.syncValue = {
          lat: pos.lat(),
          lng: pos.lng()
        };
      }
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }
};
</script>