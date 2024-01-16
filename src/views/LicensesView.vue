<script setup lang="ts">
import licenses from '@/assets/licenses.json'
import LicenseEntry from '@/components/LicenseEntry.vue'

interface License {
  name: string,
  licenses: string,
  publisher?: string,
  version?: string,
  description?: string,
  repository?: string,
  copyright?: string,
  licenseText?: string
}

const licensesList: License[] = Object.values(licenses)
</script>

<template>
  <section class="container mx-auto max-w-5xl mt-5 px-3">
    <div class="text-center max-w-3xl mx-auto">
      <h2 class="text-4xl md:text-5xl">
        Licenses
      </h2>
      <p class="my-8">
        This project uses various third-party libraries. You can find the list of them and their licenses below. Click
        on the name of the library to view more details.
      </p>
    </div>
    <div class="flex flex-col gap-3">
      <LicenseEntry v-for="(license, index) in licensesList" :key="index" :license="license" />
    </div>
  </section>
</template>
