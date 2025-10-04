<template>
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset">
        <div class="flex items-center justify-around px-2 py-2">
            <button v-for="item in navItems" :key="item.name" :class="[
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition flex-1',
                item.active ? 'text-[#4255FF]' : 'text-gray-400'
            ]" @click="navigate(item.name)">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath" />
                </svg>
                <span class="text-xs font-medium">{{ item.label }}</span>
            </button>
        </div>
    </nav>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
    name: 'BottomNavigation',
    setup() {
        const router = useRouter()

        const navItems = ref([
            {
                name: 'home',
                label: 'Start',
                active: router.currentRoute.value.path === '/home',
                iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
            },
            {
                name: 'library',
                label: 'Bibliothek',
                active: router.currentRoute.value.path === '/library',
                iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
            },
            {
                name: 'add',
                label: 'Erstellen',
                active: router.currentRoute.value.path === '/create',
                iconPath: 'M12 4v16m8-8H4'
            },
            {
                name: 'profile',
                label: 'Profil',
                active: router.currentRoute.value.path === '/profile',
                iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            }
        ])

        const navigate = (name: string) => {
            navItems.value.forEach(item => {
                item.active = item.name === name
            })

            if (name === 'library') router.push('/library')
            else if (name === 'add') router.push('/create')
            else if (name === 'profile') router.push('/profile')
            else router.push('/home')
        }

        return { navItems, navigate }
    }
}
</script>