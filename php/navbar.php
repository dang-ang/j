
<style>/* Base styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #222;
  padding: 10px 20px;
  color: white;
}

.logo a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.2em;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links li a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links li a:hover {
  color: #ddd;
}

/* Hamburger icon */
.hamburger {
  display: none;
  font-size: 1.5em;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    flex-direction: column;
    background-color: #333;
    position: absolute;
    top: 60px;
    right: 0;
    width: 200px;
    padding: 10px;
  }

  .nav-links.show {
    display: flex;
  }

  .hamburger {
    display: block;
  }
}
</style>


<nav class="navbar">
  <div class="logo">
    <a href="index.php"><?php echo $playerName ?></a>
  </div>
  <div class="hamburger" onclick="toggleMenu()">
    ☰
  </div>
  <ul class="nav-links" id="navMenu">
    <li><a href="index.php">Home</a></li>
    <li><a href="contact.php">Contact Us</a></li>
    <li><a href="aboutus.php">About Us</a></li>
    <li><a href="faq.php">FAQ</a></li>
  </ul>
</nav>

<script>
// JS toggle
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("show");
}


</script>