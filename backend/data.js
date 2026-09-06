// Mock seed data - shop config driven, not hardcoded in frontend
// Images match the premium templates (lh3.googleusercontent) for pixel-perfect demo
export const shops = {
  brewhaus: {
    id: "brewhaus",
    name: "Brew & Bloom",
    tagline: "Crafted with passion, served with love.",
    // use template logo
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6noVLSp-qZRIEg0okEnkdhEq5h_SX51pcm3DMGTvasjKSRgmcsnGFpHiYirdVQwvVAoxV5WjM9KelnxioTnuulu8ogalUUzvYD9yPaXgO8wV0PN83eZGqfhXDS0RFi6Y5fAlqPhgbgr74bw86ys0YFUknfJfyCKudFVY-O7JGNyupxTNJm-crXxDZum28_m4VtZWI5XbDwNapYgbrnrgqcaxMQUuTO-Hfla6rRM_TORtUlAgvbsFv",
    brandColor: "#25160e",
    accentColor: "#a33d1b",
    address: "MG Road, Bengaluru",
    bgPattern: "#fbf9f5",
    phone: "+91 98765 43210",
  },
  demo: {
    id: "demo",
    name: "Artisanal Brew",
    tagline: "Crafted with passion, served with love.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6noVLSp-qZRIEg0okEnkdhEq5h_SX51pcm3DMGTvasjKSRgmcsnGFpHiYirdVQwvVAoxV5WjM9KelnxioTnuulu8ogalUUzvYD9yPaXgO8wV0PN83eZGqfhXDS0RFi6Y5fAlqPhgbgr74bw86ys0YFUknfJfyCKudFVY-O7JGNyupxTNJm-crXxDZum28_m4VtZWI5XbDwNapYgbrnrgqcaxMQUuTO-Hfla6rRM_TORtUlAgvbsFv",
    brandColor: "#25160e",
    accentColor: "#a33d1b",
    address: "Demo Street",
    bgPattern: "#fbf9f5",
    phone: "+91 90000 00000",
  },
};

export const categories = [
  { id: "food", label: "Food", icon: "restaurant", sort: 1 },
  { id: "coffee", label: "Coffee", icon: "coffee", sort: 2 },
  { id: "mojitos", label: "Mojitos", icon: "local_bar", sort: 3 },
  // status is injected in frontend
];

export const menuItems = [
  // Food — bento style
  { id: "f1", category: "food", name: "Avocado Toast", price: 249, description: "Smashed avocado, heirloom tomatoes, microgreens, and a drizzle of balsamic glaze on rustic sourdough.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzSA3oEvR8azgDms8ajAEYTJM5OvbPI3IN7MOcVyrWCTQGFWKEYzEtGtZXlRRAct4gVjK31Ej6ysSG1PTuQQIsSolmANVoj9FK6GoOZmJOqTjjfBdmrtX3C56JxaDKYJfroP2RshMahgECxJHtwIaqSfNO5pFHNmCc71XQMBMISJrx22Ti2a-K7ozYXBfwI1EyFYfweNBo75lU8v7FR2U__SIx-47zUF4meqmC0LcKBMdUFXabEBom", veg: true, badge: "Best Seller", available: true, popular: true },
  { id: "f2", category: "food", name: "Acai Bowl", price: 279, description: "Organic acai topped with fresh berries, banana slices, house-made granola, and coconut flakes.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAd9Wb1MCMHCVJybhnGyV73J8Aa86hB060kwVyIWYUhCj53pRnXXVUDoKAEKdtClntSBYy3RWsI3V0rhjuDQz3g0-ynG2X37ucUrgzbslSF6Ix6B2y7k007_ZfIaxLoD5mtMczcy4RFGRGxnDXA9yNo0Jbtkj7H_CkYHlo3agg8tt5BOUJZEne5i5Q6hXHR72Vp8KEcg9_jmTcRSeAzGOhFpJDSRiXQAkhkf5e58GQd8R8ySbY-VRi5", veg: true, badge: "Gluten-Free", available: true },
  { id: "f3", category: "food", name: "Truffle Parmesan Fries", price: 269, description: "Shoestring fries tossed in white truffle oil, dusted with aged parmesan and fresh parsley. Served with garlic aioli.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACoWvTvnbXzDLLyRGPubmPv--lXJeuWpfRKIfR4Yk9ojYxAeprUzorb26MoqrKB7pnGVdRSLJ8I7FAzesnuJoAcQ8WJK8L9RcF-nsCDx2s1iTCB1rtD_fBwaFeuYo3HyIQfsFyDKp-eAcRvV_Tv7UmqbqPlutxsUWB0D2HlF_0R16D6Q69GIRQ1cjut5GMI0NSTPFMXYo6kdzy_NSd_6cayBIBe2EV3tJro-_6e-iVajIoeqaQkEKd", veg: true, badge: "Shareable", available: true },
  { id: "f4", category: "food", name: "Brioche Breakfast Sandwich", price: 319, description: "Fluffy folded egg, thick-cut smoked bacon, sharp cheddar, and caramelized onion jam on a butter-toasted brioche bun.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0fdEIbncyOFoGsl1I94TerydFt3FtCFbK26jfSm1Ag8cWYqATkwMxRWKuzoQifZ_umXbvXbJVt7iMUFqwJ0hUEF_TktTOKWEoG-y4s-KtbXLOdn_qaWXI5eMM0GjvNWRn0MscmHr00xwC1in_qMjNzFtT9-cmqX3jbUCIQNXcPlY9fDl-VbVdn1JA1mvfWoGJ4x1l4iHp9v-tJaDHYVmwrC20fPVWpLKcpSWe88kcH9quGqjszhYq", veg: false, badge: "New Item", available: true },
  { id: "f5", category: "food", name: "Mushroom & Cheese Melt", price: 299, description: "Wild mushrooms, mozzarella, caramelized onions on sourdough.", image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600&h=400&fit=crop", veg: true, available: false },
  // Coffee — horizontal list style
  { id: "c1", category: "coffee", name: "Oat Milk Latte", price: 189, description: "Smooth, creamy oat milk expertly steamed with our signature espresso blend.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW3ClLn6t7EYXbyHADRO1Hl8YAr-1UJZdQvLifLOXzLsgSkOfppnlVnNjupc8dgBWWfH9lvms65S3gMr70nDktsxFrGK5Rn-BieO9n8wPzBjYpWAhGngIN33zo0nzjjHTtCJoKGt0S-V1LLiYW2LUYEGGXrQIj3JtxafOw12vAnfU-vaf8KUIhsnCB_7_661md_o4-0zGXKvn6uw77dJAxgYa5_c4helVwABvWeXg5cizd7e-WwnBi", veg: true, badge: "Popular", available: true, popular: true },
  { id: "c2", category: "coffee", name: "Cold Brew", price: 179, description: "Steeped for 18 hours for a remarkably smooth, low-acid iced coffee experience.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZy0fEhuA-OCeQDarBHrfiUBYvfeQbXBurQKDNmjoscd3rnzOYJBSzy061cRaLssOQInNnJLJadR708CsrV7_veaodS_-zeKUhxAUPQYF6G5-3wuv197SzB31uiiHuVK3xBVWJ4j6sE3dGfLgHyzjg3-d5e3COYNiXws7DXspj6MPzNpP8sRoRJiet76kEfQtE353IcAQly9OLetPi_i9BMlD3GDVjnK4Ow-iN_nB3wxcA24HyRlON", veg: true, available: true },
  { id: "c3", category: "coffee", name: "Cappuccino", price: 189, description: "Equal parts espresso, steamed milk, and a deep layer of airy milk foam.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHYO1-nRIWnH6h9Uiyjy5_h8UOxT_d4LC5GxNi_Ih3XLXKBsh63rqKoJafJyU-YzSgOscD24OvZVt2sFy-asnoIhHTaOAgMdaOCJ8fRoMSeSjL6Cc_8cwQgL54OBd4T7Mf2CBIVl3I0TfSSZ1DbcaAvFvxd-WB-hLExv9IYOXYnaLrm11hDJJABmfO2rOA9POYfb_VvbpSvnFlobSLs5EyeQLKnQFxV7lsiCOAtb2FYo4JDocbDDQ4", veg: true, badge: "Classic", available: true },
  { id: "c4", category: "coffee", name: "Caramel Macchiato", price: 219, description: "Vanilla-flavored syrup marked with espresso and finished with caramel drizzle.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkSB3iT6M583261R7ZWETKiSDbtc0kqFxD-PZO--UbT942AbdOT5dwIT-b4kR5KC6RaBk2ort163AcZDhtwVR8vuoGEErbrgq6PVJiN-VgUGTmR5Nav4GtsjIJjlsrWOeQgTcupscZaaAYOjs6iElGTjqB08AyhNc3MYZ3PUQB0EjzK-m9K06NYlKMLgcah17F5WN2J0ikoBjUWeq3ctsk5-ELR8wN2NvZBfwdrEjHbRzn5Hx6zky4", veg: true, available: true, popular: false },
  { id: "c5", category: "coffee", name: "Flat White", price: 199, description: "Ristretto + steamed milk, silky smooth.", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop", veg: true, available: true },
  // Mojitos — image left, content right
  { id: "m1", category: "mojitos", name: "Classic Mint Mojito", price: 189, description: "White rum, fresh lime juice, cane sugar syrup, muddled mint, and a splash of club soda. The timeless standard.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSNyOM_ZYbCH3EDrkRPD5QwSN4oX2USnKC9j2M9RcFF8awqCkgB0XgSwXuaM7t_6L09GMo_9df818dn0dGf8yws62iYvhTa-Wm0Y5wMqY3QCIx-kkayYPZVdZYTcLqC30iSaofAecJxI1vLQM9RwrFroIXUp7C-rJfmXj2FjUYPbAxXMZ9hyxzf26NGP6t0bZlpXxpjAtehQhU4WypcMTJd1Y-uSDT5BS4UWxHb5Ef62PLYJSWcJNJ", veg: true, badge: "Classic", available: true, popular: true },
  { id: "m2", category: "mojitos", name: "Strawberry Basil Mojito", price: 199, description: "Muddled fresh strawberries and sweet basil leaves mixed with light rum, lime, and soda. A sweet and herbaceous twist.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvPe8uwgq6rv_c8AcbGK4ZqmHTtekfw7Qpww7pZ5KWClXv-fABYY56MmvRZ3OdBi_saEdOW__nzW5eOoNKsnTihQ914neNz0joqZZ9JaMgUUQr-jje3RvdtpQbLnqewiz98mC8lGFZ1GRNXMFO2_28q6TZw8PO-vpAGWfVacNWdu9B9ixNqH6kgwSKJ8x4Ox4xL6lIWpW2m2JLMPhASxbQvpcchOcgRKQjlEH8D8EDNN5o9Sok7Cfx", veg: true, badge: "Popular", available: true },
  { id: "m3", category: "mojitos", name: "Mango Chili Mojito", price: 199, description: "Sweet mango purée and a hint of fresh chili pepper shaken with rum, mint, and lime. Sweet heat in a glass.", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop", veg: true, badge: "Spicy", available: true },
  { id: "m4", category: "mojitos", name: "Watermelon Mojito", price: 199, description: "Freshly pressed watermelon juice, rum, mint, lime, and simple syrup. The ultimate summer cooler.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtYHuAdJcgftfswpG9wP05NMolk_KYYsISVi3z07GjLSeSVzDjzc3XVBuoEr5l-iDfAoXPyXumAKBGceuF0yjBi4zd_iG4ovVimeLtHrMRCFCCO2yq1xoquql-F2-JzN7Mbac3XkWOfy2XhUMLOWYiJi1YGx1ES1tys3D1ORoHONqiIgrt0TndNbgfIj-C2Mj6swaphXxRJ1GOOnXhAb7JdlCYybozOtN-SkXv_81LiyFO6cRRX5kR", veg: true, available: true },
];

export const ORDER_STATUSES = ["placed", "preparing", "ready", "served"];
