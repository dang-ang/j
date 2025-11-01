<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us</title>
    <link rel="stylesheet" href="css/style_p.css"> <!-- Link your custom stylesheet -->
    <!-- Link Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>

<body>

    <!-- Include the original navbar -->
    <?php include 'navbar.php'; ?>

    <!-- About Us Section: Cards Layout -->
    <div class="container my-4">
        <h1>About Us</h1>
        <p>Welcome to Vacation Hub! We are dedicated to helping you plan and register your dream vacations.</p>

        <div class="row">
            <!-- Card 1: Introduction to Vacation Hub -->
            <div class="col-md-3 my-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Who We Are</h5>
                        <p class="card-text">We are a team of passionate travel enthusiasts, working hard to create the
                            best vacation planning platform for you.</p>
                    </div>
                </div>
            </div>

            <!-- Card 2: Our Mission -->
            <div class="col-md-3 my-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Our Mission</h5>
                        <p class="card-text">Our mission is to simplify the vacation planning process and provide
                            personalized recommendations for your dream getaway.</p>
                    </div>
                </div>
            </div>

            <!-- Card 3: Our Values -->
            <div class="col-md-3 my-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Our Values</h5>
                        <p class="card-text">We believe in providing trustworthy, transparent, and seamless services to
                            help you enjoy your vacations stress-free.</p>
                    </div>
                </div>
            </div>

            <!-- Card 4: Our Future -->
            <div class="col-md-3 my-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Looking Ahead</h5>
                        <p class="card-text">We are constantly innovating to offer more services and destinations,
                            ensuring we meet all your vacation needs.</p>
                    </div>
                </div>
            </div>
        </div>

        <p>Whether you're seeking adventure, relaxation, or exploration, we're here to guide you every step of the way.
            Stay tuned for our official launch!</p>
    </div>

    <!-- Link Bootstrap JS (Optional) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>