pkg load image;

function [RING_0, RING_1, RING_2, RING_3] = rings(ROI)
	DISTANCE = floor(bwdist(bwperim(ROI, 4))) .* ROI;
	maximum = max(max(DISTANCE));
	RINGS = ROI .+ (DISTANCE >= floor(maximum / 4)) .+ (DISTANCE >= floor(maximum / 2)) .+ (DISTANCE >= floor(maximum / 4 * 3));
	RING_0 = RINGS == 1;
	RING_1 = RINGS == 2;
	RING_2 = RINGS == 3;
	RING_3 = RINGS == 4;
endfunction

function F = intensity_features(IMAGE, MASK)
	ROI = IMAGE .* MASK;
	HIST = imhist(ROI)'; 
	HIST(1) = 0;
	HIST ./= sum(HIST);
	
	mean = sum((0 : 255) .* HIST);
	variance = sum(((0 : 255) .- mean) .^ 2 .* HIST);
	skewness = sum(((0 : 255) .- mean) .^ 3 .* HIST);
	kurtosis = sum(((0 : 255) .- mean) .^ 4 .* HIST);
	
	F(1) = mean;
	F(2) = variance;
	F(3) = skewness;
	F(4) = kurtosis;
endfunction

function F = texture_features(IMAGE, MASK)
	ROI = IMAGE .* MASK;
	GLCM_0   = graycomatrix(ROI, 256, 1,   0) .+ graycomatrix(ROI, 256, -1,   0);
	GLCM_45  = graycomatrix(ROI, 256, 1,  45) .+ graycomatrix(ROI, 256, -1,  45);
	GLCM_90  = graycomatrix(ROI, 256, 1,  90) .+ graycomatrix(ROI, 256, -1,  90);
	GLCM_135 = graycomatrix(ROI, 256, 1, -45) .+ graycomatrix(ROI, 256, -1, -45);
	GLCM = GLCM_0 .+ GLCM_45 .+ GLCM_90 .+ GLCM_135;
	GLCM(1, :) = GLCM(:, 1) = 0;
	GLCM ./= sum(sum(GLCM));
	
	EEi_0 = zeros(256, 256) .+ (0 : 255)';
	EEj_0 = zeros(256, 256) .+ (0 : 255);
	
	Pi = sum(GLCM');
	Pj = sum(GLCM);
	Ui = sum((0 : 255) .* Pi);
	Uj = sum((0 : 255) .* Pj);
	Si = sqrt(sum(Pi .* ((0 : 255) .- Ui) .^ 2));
	Sj = sqrt(sum(Pj .* ((0 : 255) .- Uj) .^ 2));
	
	
	autocorrelation = sum(sum((Pi .- Ui) .* (Pj .- Uj))) / (Si * Sj);
	correlation = sum(sum((EEi_0 .- Ui) .* (EEj_0 .- Uj) .* GLCM)) / (Si * Sj);
	inertia = sum(sum(GLCM .* (EEi_0 .- EEj_0) .^ 2));
	energy = sum(sum(GLCM .^ 2));
	homogeneity = sum(sum(GLCM ./ (1 .+ abs(EEi_0 .- EEj_0))));
	entropy = -sum(sum(GLCM .* log10(GLCM .+ 0.0000000000000001)));
	dissimilarity = sum(sum(GLCM .* abs(EEi_0 .- EEj_0)));
	cluster_shape = sum(sum(GLCM .* (EEi_0 .+ EEj_0 .- Ui .- Uj) .^ 2));
	cluster_shade = sum(sum(GLCM .* (EEi_0 .+ EEj_0 .- Ui .- Uj) .^ 3));
	cluster_prominence = sum(sum(GLCM .* (EEi_0 .+ EEj_0 .- Ui .- Uj) .^ 4));
	inverse_difference_moment = sum(sum(GLCM ./ (1 .+ (EEi_0 .- EEj_0) .^ 2)));
	sum_average = sum(sum(GLCM .* (EEi_0 .+ EEj_0)));
	sum_variance = sum(sum(GLCM .* (EEi_0 .+ EEj_0 .- sum_average) .^ 2));
	maximum = max(max(GLCM));
	
	F(1) = autocorrelation;
	F(2) = correlation;
	F(3) = inertia;
	F(4) = energy;
	F(5) = homogeneity;
	F(6) = entropy;
	F(7) = dissimilarity;
	F(8) = cluster_shape;
	F(9) = cluster_shade;
	F(10) = cluster_prominence;
	F(11) = inverse_difference_moment;
	F(12) = sum_average;
	F(13) = sum_variance;
	F(14) = maximum;
endfunction

function F = shape_features(IMAGE, MASK)
	PROPS = regionprops(MASK, IMAGE, "all");
	
	area = bwarea(MASK);
	perimeter = PROPS.Perimeter;
	eccentricity = PROPS.Eccentricity;
	solidity = PROPS.Solidity;
	extent = PROPS.Extent;
	minor_axis_length = PROPS.MinorAxisLength;
	major_axis_length = PROPS.MajorAxisLength;
	slimness = minor_axis_length / major_axis_length;
	
	F(1) = area;
	F(2) = perimeter;
	F(3) = eccentricity;
	F(4) = solidity;
	F(5) = extent;
	F(6) = minor_axis_length;
	F(7) = major_axis_length;
	F(8) = slimness;
endfunction

I = imread("public/image.png");
M = imread("public/mask.png");

[n, m] = size(I)

Z = M - imerode(M, strel("disk", 3, 0));
R = I;
G = I;
B = I;
R(Z == 1) = 255;
G(Z == 1) = 0;
B(Z == 1) = 0;
P = uint8(zeros(n, m, 3));
P(:, :, 1) = R;
P(:, :, 2) = G;
P(:, :, 3) = B;
imwrite(uint8(P), "public/result.png");

D = imdilate(M, strel("disk", 8, 0));

[R0, R1, R2, R3] = rings(D);

F_TR = [intensity_features(I, M), texture_features(I, M), shape_features(I, M)];
F_R0 = [intensity_features(I, R0), texture_features(I, R0)];
F_R1 = [intensity_features(I, R1), texture_features(I, R1)];
F_R2 = [intensity_features(I, R2), texture_features(I, R2)];
F_R3 = [intensity_features(I, R3), texture_features(I, R3)];

csvwrite("public/features.csv", [F_TR, F_R0, F_R1, F_R2, F_R3]);
