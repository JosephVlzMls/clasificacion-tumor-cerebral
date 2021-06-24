pkg load image;

I = imread("public/image.png");
M = imread("public/mask.png");

R = I;
G = I;
B = I;
R(bwperim(M) == 1) = 255;
G(bwperim(M) == 1) = 0;
B(bwperim(M) == 1) = 0;

ROI = M .* I;

imwrite(ROI, "public/ROI.png");